///////////////////////////////////////
//TICKET TOPIC SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:update-ticket-priority"))
    opendiscord.actions.get("opendiscord:update-ticket-priority").workers.add([
        new api.ODWorker("opendiscord:update-ticket-priority",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,newPriority,reason} = params
            if (channel.isThread() || !(channel instanceof discord.TextChannel)) throw new api.ODSystemError("Unable to set priority of ticket! Open Ticket doesn't support threads!")

            const oldPriority = opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value)
            await opendiscord.events.get("onTicketPriorityChange").emit([ticket,user,channel,oldPriority,newPriority,reason])

            //update ticket
            ticket.get("opendiscord:busy").value = true
            if (newPriority) ticket.get("opendiscord:priority").value = newPriority.priority

            //rename channel (and give error when crashed)
            const pinEmoji = ticket.get("opendiscord:pinned").value ? generalConfig.data.system.pinEmoji : ""
            const priorityEmoji = newPriority.channelEmoji ?? ""

            const originalName = channel.name
            const newName = pinEmoji+priorityEmoji+utilities.trimEmojis(channel.name)
            try{
                await utilities.timedAwait(channel.setName(newName),2500,(err) => {
                    opendiscord.log("Failed to rename channel on ticket priority update","error")
                })
            }catch(err){
                await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-priority",{guild,channel,user,originalName,newName})).message)
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:priority-set").build(source,{guild,channel,user,ticket,priority:newPriority,reason})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketPriorityChanged").emit([ticket,user,channel,oldPriority,newPriority,reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action",{guild,channel,user,ticket,sendMessage:false,newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket,newPriority} = params

            opendiscord.log(user.displayName+" changed the priority of a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"priority",value:newPriority.id.value},
                {key:"method",value:source}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:update-ticket-priority").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}