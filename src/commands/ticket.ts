///////////////////////////////////////
//TICKET COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities, openticketUtils} from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages

async function checkTicketCreationPerms(instance:api.ODButtonResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance|api.ODCommandResponderInstance,origin:api.ODActionManagerIdMappings["opendiscord:create-ticket-permissions"]["origin"],guild:discord.Guild,user:discord.User,option:api.ODTicketOption){
    //check ticket permissions
    const permsRes = await opendiscord.actions.get("opendiscord:create-ticket-permissions").run(origin,{guild,user,option})
    if (!permsRes.valid && instance.channel){
        //error
        const newOrigin = (origin === "slash" || origin === "text") ? origin : "other"
        if (permsRes.reason == "blacklist") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-blacklisted").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        else if (permsRes.reason == "cooldown") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-cooldown").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,until:permsRes.cooldownUntil}))
        else if (permsRes.reason == "global-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global"}))
        else if (permsRes.reason == "global-user-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global-user"}))
        else if (permsRes.reason == "option-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option"}))
        else if (permsRes.reason == "option-user-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option-user"}))
        else if (permsRes.reason == "custom") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,layout:"simple",error:permsRes.customReason ?? lang.getTranslation("errors.descriptions.unableToCreateTicket")+" `Unknown invalid_permission_reason => no reason specified by plugin`",customTitle:lang.getTranslation("errors.titles.permissionError")}))
        else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(newOrigin,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Unknown invalid_permission reason => calculation failed #1",layout:"advanced"}))
        return false
    }else return true
}

export async function registerCommandResponders(){
    //TICKET COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:ticket",generalConfig.data.prefix,/^ticket/))
    opendiscord.responders.commands.get("opendiscord:ticket").workers.add([
        new api.ODWorker("opendiscord:ticket",0,async (instance,params,origin,cancel) => {
            const {user,member,channel,guild} = instance
            
            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance,origin,"ticket")
            if (!hasPerms) return cancel()
            
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //get option data
            const optionId = instance.options.getString("id",true)
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }
            
            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //SEND MODAL
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:ticket-questions").build(origin,{guild,channel,user,option}))
            }else{
                //check ticket permissions (modals need check after submit)
                if (!(await checkTicketCreationPerms(instance,origin,guild,user,option))) return cancel()
            
                //CREATE TICKET
                await instance.defer(true)
                const res = await opendiscord.actions.get("opendiscord:create-ticket").run(origin,{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build(origin,{guild,channel:res.channel,user,ticket:res.ticket}))
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,origin,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'ticket' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders(){
    //TICKET OPTION BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:ticket-option",/^od:ticket-option_/))
    opendiscord.responders.buttons.get("opendiscord:ticket-option").workers.add(
        new api.ODWorker("opendiscord:ticket-option",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user} = instance
            
            //responder checks
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //get option data
            const optionId = instance.interaction.customId.split("_")[2]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //SEND MODAL
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:ticket-questions").build("panel-button",{guild,channel,user,option}))
            }else{
                //check ticket permissions (modals need check after submit)
                if (!(await checkTicketCreationPerms(instance,"panel-button",guild,user,option))) return cancel()
            
                //CREATE TICKET
                await instance.defer((generalConfig.data.ticketSystem.replyOnTicketCreation) ? "reply" : "update",true)

                const res = await opendiscord.actions.get("opendiscord:create-ticket").run("panel-button",{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                if (generalConfig.data.ticketSystem.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build("panel-button",{guild,channel:res.channel,user,ticket:res.ticket}))
            }
        })
    )
}

export async function registerDropdownResponders(){
    //PANEL DROPDOWN TICKETS DROPDOWN RESPONDER
    opendiscord.responders.dropdowns.add(new api.ODDropdownResponder("opendiscord:panel-dropdown-tickets",/^od:panel-dropdown_/))
    opendiscord.responders.dropdowns.get("opendiscord:panel-dropdown-tickets").workers.add(
        new api.ODWorker("opendiscord:panel-dropdown-tickets",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user} = instance
            
            //responder checks
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //get option data
            const optionId = instance.values.getStringValues()[0].split("_")[2]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //SEND MODAL
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:ticket-questions").build("panel-dropdown",{guild,channel,user,option}))
            }else{
                //check ticket permissions (modals need check after submit)
                if (!(await checkTicketCreationPerms(instance,"panel-dropdown",guild,user,option))) return cancel()
            
                //CREATE TICKET
                await instance.defer((generalConfig.data.ticketSystem.replyOnTicketCreation) ? "reply" : "update",true)

                const res = await opendiscord.actions.get("opendiscord:create-ticket").run("panel-dropdown",{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                if (generalConfig.data.ticketSystem.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build("panel-dropdown",{guild,channel:res.channel,user,ticket:res.ticket}))
            }

            //update panel after dropdown usage (reset panel choice)
            const globalDatabase = opendiscord.databases.get("opendiscord:global")
            const rawPanelId = await globalDatabase.get("opendiscord:panel-message",instance.message.channel.id+"_"+instance.message.id)
            if (rawPanelId){
                const panel = opendiscord.panels.get(rawPanelId)
                if (panel) await instance.message.edit((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("auto-update",{guild,channel,user,panel})).message)
            }
        })
    )
}

export async function registerModalResponders(){
    //TICKET QUESTIONS RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:ticket-questions",/^od:ticket-questions_/))
    opendiscord.responders.modals.get("opendiscord:ticket-questions").workers.add([
        new api.ODWorker("opendiscord:ticket-questions",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user} = instance
            
            //responder checks
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            //get option data
            const optionId = instance.interaction.customId.split("_")[1]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel,user:instance.user}))
                return cancel()
            }

            //check ticket permissions (modals need check after submit)
            const originalOrigin = instance.interaction.customId.split("_")[2] as ("panel-button"|"panel-dropdown"|"slash"|"text"|"other")
            if (!(await checkTicketCreationPerms(instance,originalOrigin,guild,user,option))) return cancel()

            //get answers
            const answers: {id:string,name:string,type:"short"|"paragraph",value:string|null}[] = []
            option.get("opendiscord:questions").value.forEach((id) => {
                const question = opendiscord.questions.get(id)
                if (!question) return
                if (question instanceof api.ODShortQuestion){
                    answers.push({
                        id,
                        name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : id,
                        type:"short",
                        value:instance.values.getTextField(id,false)
                    })
                }else if (question instanceof api.ODParagraphQuestion){
                    answers.push({
                        id,
                        name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : id,
                        type:"paragraph",
                        value:instance.values.getTextField(id,false)
                    })
                }
            })
            
            await instance.defer((generalConfig.data.ticketSystem.replyOnTicketCreation) ? "reply" : "update",true)

            //CREATE TICKET
            const res = await opendiscord.actions.get("opendiscord:create-ticket").run(originalOrigin,{guild,user,answers,option})
            if (!res.channel || !res.ticket){
                //error
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel,user,error:"Unable to receive ticket or channel from callback! #2",layout:"advanced"}))
                return cancel()
            }
            if (generalConfig.data.ticketSystem.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build(originalOrigin,{guild,channel:res.channel,user,ticket:res.ticket}))
        })
    ])
}