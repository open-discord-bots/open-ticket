///////////////////////////////////////
//TRANSFER COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //TRANSFER COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:transfer",generalConfig.data.prefix,"transfer"))
    opendiscord.responders.commands.get("opendiscord:transfer").workers.add([
        new api.ODWorker("opendiscord:transfer",0,async (instance,params,source,cancel) => {
            const {user,member,channel,guild} = instance
                                    
            //check permissions
            const permsResult = await opendiscord.permissions.checkCommandPerms(generalConfig.data.system.permissions.transfer,"support",user,member,channel,guild)
            if (!permsResult.hasPerms){
                if (permsResult.reason == "not-in-server") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild,channel,user,permissions:["support"]}))
                return cancel()
            }

            //check is in guild/Server
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

            const oldCreator = await opendiscord.tickets.getTicketUser(ticket,"creator") ?? opendiscord.client.client.user
            const newCreator = instance.options.getUser("user",true)
            const reason = instance.options.getString("reason",false)

            //start transferring ticket ownership
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:transfer-ticket").run(source,{guild,channel,user,ticket,reason,sendMessage:false,newCreator})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:transfer-message").build(source,{guild,channel,user,ticket,oldCreator,newCreator,reason}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'transfer' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}