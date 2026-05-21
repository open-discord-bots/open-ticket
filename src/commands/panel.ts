///////////////////////////////////////
//STATS COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities, openticketUtils} from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders(){
    //PANEL COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:panel",generalConfig.data.prefix,/^panel/))
    opendiscord.responders.commands.get("opendiscord:panel").workers.add([
        new api.ODWorker("opendiscord:panel",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user,member} = instance
            
            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance,origin,"panel")
            if (!hasPerms) return cancel()
            
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()
            
            const ticket = await openticketUtils.replyIsTicket(instance,origin)
            if (!ticket) return cancel()
            
            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance,origin,ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const id = instance.options.getString("id",true)
            const panel = opendiscord.panels.get(id)
            if (!panel){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-panel-unknown").build(origin,{guild,channel,user}))
                return cancel()
            }
            
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:panel-ready").build(origin,{guild,channel,user,panel}))
            const panelMessage = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:panel").build(origin,{guild,channel,user,panel})).message)

            //add panel to database (this way, the bot knows where all panels are located)
            const globalDatabase = opendiscord.databases.get("opendiscord:global")
            await globalDatabase.set("opendiscord:panel-message",panelMessage.channel.id+"_"+panelMessage.id,panel.id.value)
            
            //add panel to database for auto-update
            if (instance.options.getBoolean("auto-update",false)){
                await globalDatabase.set("opendiscord:panel-update",panelMessage.channel.id+"_"+panelMessage.id,panel.id.value)
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,origin,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'panel' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:origin}
            ])
        })
    ])
}