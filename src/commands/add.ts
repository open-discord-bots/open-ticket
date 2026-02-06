///////////////////////////////////////
//ADD COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //ADD COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:add",generalConfig.data.prefix,"add"))
    opendiscord.responders.commands.get("opendiscord:add").workers.add([
        new api.ODWorker("opendiscord:add",0,async (instance,params,source,cancel) => {
            const {guild,channel,user,member} = instance
            
            //check permissions
            const permsResult = await opendiscord.permissions.checkCommandPerms(generalConfig.data.system.permissions.add,"support",user,member,channel,guild)
            if (!permsResult.hasPerms){
                if (permsResult.reason == "not-in-server") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild,channel,user,permissions:["support"]}))
                return cancel()
            }

            //check if in guild/Server
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }

            //check if ticket exists
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            const data = instance.options.getUser("user",true)
            const reason = instance.options.getString("reason",false)

            //return when user already added to ticket
            const participants = await opendiscord.tickets.getAllTicketParticipants(ticket)
            if (!participants || participants.find((p) => p.user.id == data.id)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.add"),layout:"simple"}))
                return cancel()
            }

            //start adding user to ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:add-ticket-user").run(source,{guild,channel,user,ticket,reason,sendMessage:false,data})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:add-message").build(source,{guild,channel,user,ticket,reason,data}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'add' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}