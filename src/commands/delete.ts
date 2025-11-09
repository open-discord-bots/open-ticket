///////////////////////////////////////
//DELETE COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages

export const registerCommandResponders = async () => {
    //DELETE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:delete",generalConfig.data.prefix,"delete"))
    opendiscord.responders.commands.get("opendiscord:delete").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("opendiscord:delete",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
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
            //return when not allowed because of missing messages
            if (!generalConfig.data.system.allowCloseBeforeMessage || !generalConfig.data.system.allowCloseBeforeAdminMessage){
                const analysis = await opendiscord.transcripts.collector.ticketUserMessagesAnalysis(ticket,guild,channel)
                if (analysis && !generalConfig.data.system.allowCloseBeforeMessage && analysis.totalMessages < 1){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,layout:"simple",error:lang.getTranslation("errors.descriptions.closeBeforeMessage"),customTitle:lang.getTranslation("errors.titles.noPermissions")}))
                    return cancel()
                }
                if (analysis && !generalConfig.data.system.allowCloseBeforeAdminMessage && analysis.adminMessages < 1){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,layout:"simple",error:lang.getTranslation("errors.descriptions.closeBeforeAdminMessage"),customTitle:lang.getTranslation("errors.titles.noPermissions")}))
                    return cancel()
                }
            }

            const reason = instance.options.getString("reason",false)
            const withoutTranscript = instance.options.getBoolean("notranscript",false) ?? false

            //don't allow deleteWithoutTranscript to non-global-admins when enabled
            if (withoutTranscript && generalConfig.data.system.adminOnlyDeleteWithoutTranscript){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild,{allowChannelRoleScope:false,allowChannelUserScope:false,allowGlobalRoleScope:true,allowGlobalUserScope:true}))){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }
            }

            //start deleting ticket
            await instance.defer(false)
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(source,{guild,channel,user,ticket,reason}))
            await opendiscord.actions.get("opendiscord:delete-ticket").run(source,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript})
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'delete' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //DELETE TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:delete-ticket",/^od:delete-ticket/))
    opendiscord.responders.buttons.get("opendiscord:delete-ticket").workers.add(
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,source,cancel) => {
            const originalSource = instance.interaction.customId.split("_")[1] as Exclude<api.ODActionManagerIds_Default["opendiscord:delete-ticket"]["source"],"slash"|"text"|"autodelete"|"clear">
            
            if (originalSource == "ticket-message") await opendiscord.verifybars.get("opendiscord:delete-ticket-ticket-message").activate(instance)
            else if (originalSource == "close-message") await opendiscord.verifybars.get("opendiscord:delete-ticket-close-message").activate(instance)
            else if (originalSource == "reopen-message") await opendiscord.verifybars.get("opendiscord:delete-ticket-reopen-message").activate(instance)
            else if (originalSource == "autoclose-message") await opendiscord.verifybars.get("opendiscord:delete-ticket-autoclose-message").activate(instance)
            else await instance.defer("update",false)
        })
    )
}

export const registerModalResponders = async () => {
    //REOPEN WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:delete-ticket-reason",/^od:delete-ticket-reason_/))
    opendiscord.responders.modals.get("opendiscord:delete-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:delete-ticket-reason",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!channel) return
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel,user:instance.user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(instance.interaction.customId.split("_")[1])
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return
            }

            const originalSource = instance.interaction.customId.split("_")[2] as Exclude<api.ODActionManagerIds_Default["opendiscord:delete-ticket"]["source"],"slash"|"text"|"autodelete"|"clear">
            const reason = instance.values.getTextField("reason",true)

            //delete with reason
            if (originalSource == "ticket-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true,withoutTranscript:false})
                //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
                ticket.get("opendiscord:for-deletion").value = true
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
            }else if (originalSource == "close-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "reopen-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "autoclose-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("other",{guild,channel,user,ticket,reason}))
            }else{
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true,withoutTranscript:false})
            }
        })
    ])
}