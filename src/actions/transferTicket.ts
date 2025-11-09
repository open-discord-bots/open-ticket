///////////////////////////////////////
//TICKET TRANSFER SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:transfer-ticket"))
    opendiscord.actions.get("opendiscord:transfer-ticket").workers.add([
        new api.ODWorker("opendiscord:transfer-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,newCreator} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to transfer ticket! Open Ticket doesn't support threads!")

            const oldCreator = await opendiscord.tickets.getTicketUser(ticket,"creator") ?? opendiscord.client.client.user
            await opendiscord.events.get("onTicketTransfer").emit([ticket,user,channel,oldCreator,newCreator,reason])
            
            //update ticket
            const oldCreatorId = ticket.get("opendiscord:opened-by").value
            if (oldCreatorId){
                ticket.get("opendiscord:previous-creators").value.push(oldCreatorId)
                ticket.get("opendiscord:previous-creators").refreshDatabase()
            }
            if (!ticket.get("opendiscord:participants").value.find((p) => p.type == "user" && p.id == newCreator.id)){
                ticket.get("opendiscord:participants").value.push({type:"user",id:newCreator.id})
                ticket.get("opendiscord:participants").refreshDatabase()
            }
            ticket.get("opendiscord:opened-by").value = newCreator.id
            if (["user-name","user-nickname","user-id"].includes(ticket.option.get("opendiscord:channel-suffix").value)){
                const newSuffix = await opendiscord.options.suffix.getSuffixFromOption(ticket.option,newCreator,guild)
                if (newSuffix) ticket.get("opendiscord:channel-suffix").value = newSuffix
            }

            //update stats
            await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:tickets-transferred",1,"increase")
            await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:tickets-transferred",user.id,1,"increase")

            //get new channel properties
            const channelPrefix = ticket.option.get("opendiscord:channel-prefix").value
            const channelSuffix = ticket.get("opendiscord:channel-suffix").value

            //handle permissions
            const permissions: discord.OverwriteResolvable[] = [{
                type:discord.OverwriteType.Role,
                id:guild.roles.everyone.id,
                allow:[],
                deny:["ViewChannel","SendMessages","ReadMessageHistory"]
            }]
            const globalAdmins = opendiscord.configs.get("opendiscord:general").data.globalAdmins
            const optionAdmins = ticket.option.get("opendiscord:admins").value
            const readonlyAdmins = ticket.option.get("opendiscord:admins-readonly").value

            globalAdmins.forEach((admin) => {
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory","ManageMessages"],
                    deny:[]
                })
            })
            optionAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory","ManageMessages"],
                    deny:[]
                })
            })
            readonlyAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                if (optionAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel","ReadMessageHistory"],
                    deny:["SendMessages","AddReactions","AttachFiles","SendPolls"]
                })
            })
            //transfer all old user-participants over to the new ticket (creator & participants)
            ticket.get("opendiscord:participants").value.forEach((p) => {
                if (p.type == "user") permissions.push({
                    type:discord.OverwriteType.Member,
                    id:p.id,
                    allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory"],
                    deny:[]
                })
            })
            try{
                await channel.permissionOverwrites.set(permissions)
            }catch{
                opendiscord.log("Failed to reset channel permissions on ticket transfer!","error")
            }

            //rename channel (and give error when crashed)
            const pinEmoji = ticket.get("opendiscord:pinned").value ? generalConfig.data.system.pinEmoji : ""
            const priorityEmoji = opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value).channelEmoji ?? ""
            
            const originalName = channel.name
            const newName = pinEmoji+priorityEmoji+utilities.trimEmojis(channelPrefix+channelSuffix)
            try{
                await utilities.timedAwait(channel.setName(newName),2500,(err) => {
                    opendiscord.log("Failed to rename channel on ticket transfer","error")
                })
            }catch(err){
                await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-transfer",{guild,channel,user,originalName,newName:newName})).message)
            }

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket transferring!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:transfer-message").build(source,{guild,channel,user,ticket,oldCreator,newCreator,reason})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketTransferred").emit([ticket,user,channel,oldCreator,newCreator,reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action",{guild,channel,user,ticket,sendMessage:false,newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,newCreator,reason} = params
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket,newCreator} = params

            opendiscord.log(user.displayName+" transferred a ticket to '"+newCreator.displayName+"'!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:transfer-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}