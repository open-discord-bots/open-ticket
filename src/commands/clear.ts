///////////////////////////////////////
//CLEAR COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //CLEAR COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:clear",generalConfig.data.prefix,"clear"))
    opendiscord.responders.commands.get("opendiscord:clear").workers.add([
        new api.ODWorker("opendiscord:clear",0,async (instance,params,source,cancel) => {
            const {user,member,channel,guild} = instance
                        
            //check permissions (only allow global admins: ticket admins aren't allowed to clear tickets)
            const permsResult = await opendiscord.permissions.checkCommandPerms(generalConfig.data.system.permissions.clear,"support",user,member,channel,guild,{allowChannelUserScope:false,allowChannelRoleScope:false})
            if (!permsResult.hasPerms){
                if (permsResult.reason == "not-in-server") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild,channel,user,permissions:["support"]}))
                return cancel()
            }

            //check is in guild/server
            if (!guild || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            
            const tempFilter = instance.options.getString("filter",false)
            const filter = (tempFilter) ? tempFilter.toLowerCase() as api.ODTicketClearFilter : "all"
            const list: string[] = []
            const ticketList = opendiscord.tickets.getAll().filter((ticket) => {
                if (filter == "all") return true
                else if (filter == "open" && ticket.get("opendiscord:open").value) return true
                else if (filter == "closed" && ticket.get("opendiscord:closed").value) return true
                else if (filter == "claimed" && ticket.get("opendiscord:claimed").value) return true
                else if (filter == "pinned" && ticket.get("opendiscord:pinned").value) return true
                else if (filter == "unclaimed" && !ticket.get("opendiscord:claimed").value) return true
                else if (filter == "unpinned" && !ticket.get("opendiscord:pinned").value) return true
                else if (filter == "autoclosed" && ticket.get("opendiscord:closed").value) return true
                else return false
            })
            for (const ticket of ticketList){
                const ticketChannel = await opendiscord.tickets.getTicketChannel(ticket)
                if (ticketChannel) list.push("#"+ticketChannel.name)
            }

            //reply with clear verify
            await instance.defer(true)
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:clear-verify-message").build(source,{guild,channel,user,filter,list}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'clear' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //CLEAR CONTINUE BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:clear-continue",/^od:clear-continue_/))
    opendiscord.responders.buttons.get("opendiscord:clear-continue").workers.add(
        new api.ODWorker("opendiscord:clear-continue",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild || channel.isDMBased()) return
            const originalSource = instance.interaction.customId.split("_")[1] as api.ODActionManagerIds_Default["opendiscord:clear-tickets"]["source"]
            const filter = instance.interaction.customId.split("_")[2] as api.ODTicketClearFilter
            
            //start ticket clear
            await instance.defer("update",true)
            const list: string[] = []
            const ticketList = opendiscord.tickets.getAll().filter((ticket) => {
                if (filter == "all") return true
                else if (filter == "open" && ticket.get("opendiscord:open").value) return true
                else if (filter == "closed" && ticket.get("opendiscord:closed").value) return true
                else if (filter == "claimed" && ticket.get("opendiscord:claimed").value) return true
                else if (filter == "pinned" && ticket.get("opendiscord:pinned").value) return true
                else if (filter == "unclaimed" && !ticket.get("opendiscord:claimed").value) return true
                else if (filter == "unpinned" && !ticket.get("opendiscord:pinned").value) return true
                else if (filter == "autoclosed" && ticket.get("opendiscord:closed").value) return true
                else return false
            })
            for (const ticket of ticketList){
                const ticketChannel = await opendiscord.tickets.getTicketChannel(ticket)
                if (ticketChannel) list.push("#"+ticketChannel.name)
            }

            await opendiscord.actions.get("opendiscord:clear-tickets").run(originalSource,{guild,channel,user,filter,list:ticketList})
            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:clear-message").build(originalSource,{guild,channel,user,filter,list}))
        })
    )
}