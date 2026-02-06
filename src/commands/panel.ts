///////////////////////////////////////
//STATS COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //PANEL COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:panel",generalConfig.data.prefix,/^panel/))
    opendiscord.responders.commands.get("opendiscord:panel").workers.add([
        new api.ODWorker("opendiscord:panel",0,async (instance,params,source,cancel) => {
            const {guild,channel,user,member} = instance
                        
            //check permissions
            const permsResult = await opendiscord.permissions.checkCommandPerms(generalConfig.data.system.permissions.panel,"support",user,member,channel,guild)
            if (!permsResult.hasPerms){
                if (permsResult.reason == "not-in-server") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild,channel,user,permissions:["support"]}))
                return cancel()
            }

            //check is in guild/server
            if (!guild || instance.channel.type == discord.ChannelType.GroupDM){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            
            //get panel data
            const id = instance.options.getString("id",true)
            const panel = opendiscord.panels.get(id)
            if (!panel){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-panel-unknown").build(source,{guild,channel,user}))
                return cancel()
            }
            
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:panel-ready").build(source,{guild,channel,user,panel}))
            const panelMessage = await instance.channel.send((await opendiscord.builders.messages.getSafe("opendiscord:panel").build(source,{guild,channel,user,panel})).message)

            //add panel to database (this way, the bot knows where all panels are located)
            const globalDatabase = opendiscord.databases.get("opendiscord:global")
            await globalDatabase.set("opendiscord:panel-message",panelMessage.channel.id+"_"+panelMessage.id,panel.id.value)
            
            //add panel to database for auto-update
            if (instance.options.getBoolean("auto-update",false)){
                await globalDatabase.set("opendiscord:panel-update",panelMessage.channel.id+"_"+panelMessage.id,panel.id.value)
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'panel' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}