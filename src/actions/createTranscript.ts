///////////////////////////////////////
//TRANSCRIPT CREATION SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index.js"
import * as discord from "discord.js"

const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")
const transcriptDatabase = opendiscord.databases.get("opendiscord:transcripts")

type TranscriptCompiler = api.ODTranscriptCompiler<any,object|null>
type TranscriptResult = api.ODTranscriptCompilerCompileResult<any>
type TranscriptResultItem = {compiler:TranscriptCompiler,result:TranscriptResult}

const getCompiler = (id:"opendiscord:text-compiler"|"opendiscord:html-compiler"|"opendiscord:pdf-compiler") => {
    return opendiscord.transcripts.get(id) as TranscriptCompiler|null
}

const getSelectedCompilers = () => {
    const mode = transcriptConfig.data.general.mode
    const compilers: TranscriptCompiler[] = []

    if (mode == "text"){
        const compiler = getCompiler("opendiscord:text-compiler")
        if (compiler) compilers.push(compiler)
    }else if (mode == "html"){
        const compiler = getCompiler("opendiscord:html-compiler")
        if (compiler) compilers.push(compiler)
    }else if (mode == "pdf"){
        const compiler = getCompiler("opendiscord:pdf-compiler")
        if (compiler) compilers.push(compiler)
    }else if (mode == "both"){
        const htmlCompiler = getCompiler("opendiscord:html-compiler")
        const pdfCompiler = getCompiler("opendiscord:pdf-compiler")
        if (htmlCompiler) compilers.push(htmlCompiler)
        if (pdfCompiler) compilers.push(pdfCompiler)
    }

    return compilers
}

const canStoreHistory = (result:TranscriptResult) => {
    return result.data && (("contents" in result.data && typeof result.data.contents == "string") || ("url" in result.data && typeof result.data.url == "string"))
}

const storeTranscriptHistory = async (result:TranscriptResult) => {
    if (!canStoreHistory(result)) return
    const historyData: api.ODTranscriptHistoryData = {
        ticketId:result.channel.id,
        ticketName:"#"+result.channel.name,
        ticketCreatorId:result.user.id,
        ticketCreatedDate:result.ticket.get("opendiscord:opened-on").value,
        ticketDeletedDate:Date.now(),
        transcriptType:("contents" in result.data) ? "localContents" : "remoteUrl",
        transcriptContents:("contents" in result.data) ? result.data.contents : null,
        transcriptUrl:("url" in result.data) ? result.data.url : null,
    }
    await transcriptDatabase.set("opendiscord:transcript","C:"+result.channel.id+",U:"+result.user.id,historyData)
}

const runCompilerInit = async (compiler:TranscriptCompiler,ticket:api.ODTicket,channel:discord.TextChannel,user:discord.User) => {
    if (!compiler.init) return {success:true,errorReason:null,pendingMessage:null,initData:null}
    return await compiler.init(ticket,channel,user)
}

const runCompilerCompile = async (compiler:TranscriptCompiler,ticket:api.ODTicket,channel:discord.TextChannel,user:discord.User,initData:object|null) => {
    if (!compiler.compile) return {ticket,channel,user,success:false,errorReason:"Transcript compiler is missing compile().",messages:null,data:null}
    return await compiler.compile(ticket,channel,user,initData)
}

const tryHtmlFallback = async (ticket:api.ODTicket,channel:discord.TextChannel,user:discord.User): Promise<TranscriptResultItem|null> => {
    const htmlCompiler = getCompiler("opendiscord:html-compiler")
    if (!htmlCompiler) return null

    try{
        const init = await runCompilerInit(htmlCompiler,ticket,channel,user)
        if (!init.success) return null
        const result = await runCompilerCompile(htmlCompiler,ticket,channel,user,init.initData)
        if (!result.success) return null
        return {compiler:htmlCompiler,result}
    }catch(err){
        process.emit("uncaughtException",err)
        return null
    }
}

export async function registerActions(){
    opendiscord.actions.add(new api.ODAction("opendiscord:create-transcript"))
    opendiscord.actions.get("opendiscord:create-transcript").workers.add([
        new api.ODWorker("opendiscord:select-compiler",4,async (instance,params,origin,cancel) => {
            const {channel,user,ticket} = params
            if (channel.type != discord.ChannelType.GuildText) return cancel()
            if (!transcriptConfig.data.general.enabled) return cancel()
            
            await opendiscord.events.get("onTranscriptCreate").emit([opendiscord.transcripts,ticket,channel,user])
            
            instance.errorReason = null
            const participants = await opendiscord.tickets.getAllTicketParticipants(params.ticket)
            if (!participants){
                instance.pendingMessage = null
                instance.errorReason = "Unable to fetch ticket channel participants!"
                throw new api.ODSystemError("ODAction(ot:create-transcript) => Unable to fetch ticket channel participants!")
            }
            instance.participants = participants

            instance.compilers = getSelectedCompilers()
            instance.compiler = instance.compilers[0] ?? null
            if (!instance.compiler){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript) => Unable to select transcript compiler for mode '"+transcriptConfig.data.general.mode+"'!")
            }
        }),
        new api.ODWorker("opendiscord:init-transcript",3,async (instance,params,origin,cancel) => {
            const {channel,user,ticket} = params
            if (channel.type != discord.ChannelType.GuildText) return cancel()
            if (!transcriptConfig.data.general.enabled) return cancel()
            if (!instance.compilers || instance.compilers.length < 1){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:init-transcript) => Instance is missing transcript compilers!")
            }
            
            await opendiscord.events.get("onTranscriptInit").emit([opendiscord.transcripts,ticket,channel,user])
            instance.initData = new Map<string,object|null>()
            const readyCompilers: TranscriptCompiler[] = []

            for (const compiler of instance.compilers as TranscriptCompiler[]){
                try{
                    const result = await runCompilerInit(compiler,ticket,channel,user)
                    if (result.success){
                        instance.initData.set(compiler.id.value,result.initData)
                        readyCompilers.push(compiler)
                        if (result.pendingMessage && transcriptConfig.data.general.enableChannel && !instance.pendingMessage){
                            const post = opendiscord.posts.get("opendiscord:transcripts")
                            if (post) instance.pendingMessage = await post.send(result.pendingMessage)
                        }
                    }else if (transcriptConfig.data.general.mode == "both"){
                        opendiscord.log("Skipping transcript compiler after init failure.","warning",[
                            {key:"compiler",value:compiler.id.value},
                            {key:"reason",value:result.errorReason ?? "/"}
                        ])
                    }else{
                        instance.pendingMessage = null
                        instance.errorReason = result.errorReason
                        throw new api.ODSystemError("ODAction(ot:create-transcript) => Known Init Error => "+result.errorReason)
                    }
                }catch(err){
                    if (transcriptConfig.data.general.mode == "both"){
                        process.emit("uncaughtException",err)
                        opendiscord.log("Skipping transcript compiler after init exception.","warning",[
                            {key:"compiler",value:compiler.id.value}
                        ])
                    }else{
                        instance.success = false
                        cancel()
                        process.emit("uncaughtException",err)
                        throw new api.ODSystemError("ODAction(ot:create-transcript) => Failed transcript compiler init()! (see error above)")
                    }
                }
            }

            if (readyCompilers.length < 1){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:init-transcript) => No transcript compilers initialized!")
            }
            instance.compilers = readyCompilers
            instance.compiler = readyCompilers[0]
            await opendiscord.events.get("afterTranscriptInitiated").emit([opendiscord.transcripts,ticket,channel,user])
        }),
        new api.ODWorker("opendiscord:compile-transcript",2,async (instance,params,origin,cancel) => {
            const {channel,user,ticket} = params
            if (channel.type != discord.ChannelType.GuildText) return cancel()
            if (!instance.compilers || instance.compilers.length < 1){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:compile-transcript) => Instance is missing transcript compilers!")
            }
            if (!(instance.initData instanceof Map)){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:compile-transcript) => Instance is missing transcript initData!") 
            }

            await opendiscord.events.get("onTranscriptCompile").emit([opendiscord.transcripts,ticket,channel,user])
            const results: TranscriptResultItem[] = []
            const failures: {compiler:TranscriptCompiler,reason:string|null}[] = []

            for (const compiler of instance.compilers as TranscriptCompiler[]){
                try{
                    const result = await runCompilerCompile(compiler,ticket,channel,user,instance.initData.get(compiler.id.value) ?? null)
                    if (!result.success){
                        failures.push({compiler,reason:result.errorReason})
                        if (transcriptConfig.data.general.mode == "both"){
                            opendiscord.log("Skipping failed transcript compiler.","warning",[
                                {key:"compiler",value:compiler.id.value},
                                {key:"reason",value:result.errorReason ?? "/"}
                            ])
                        }
                    }else{
                        results.push({compiler,result})
                    }
                }catch(err){
                    failures.push({compiler,reason:"Compiler exception"})
                    if (transcriptConfig.data.general.mode == "both"){
                        process.emit("uncaughtException",err)
                        opendiscord.log("Skipping failed transcript compiler.","warning",[
                            {key:"compiler",value:compiler.id.value}
                        ])
                    }else{
                        process.emit("uncaughtException",err)
                    }
                }
            }

            if (results.length < 1 && transcriptConfig.data.general.mode == "pdf"){
                const fallback = await tryHtmlFallback(ticket,channel,user)
                if (fallback){
                    opendiscord.log("PDF transcript failed; sent HTML transcript fallback.","warning",[
                        {key:"reason",value:failures[0]?.reason ?? "/"}
                    ])
                    results.push(fallback)
                }
            }

            if (results.length < 1){
                instance.success = false
                instance.errorReason = failures[0]?.reason ?? "Unable to compile transcript."
                instance.compiler = failures[0]?.compiler ?? instance.compiler
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript) => Known Compiler Error => "+instance.errorReason)
            }

            instance.results = results
            instance.result = results[0].result
            instance.compiler = results[0].compiler
            instance.success = true
            await opendiscord.events.get("afterTranscriptCompiled").emit([opendiscord.transcripts,ticket,channel,user])
        }),
        new api.ODWorker("opendiscord:ready-transcript",1,async (instance,params,origin,cancel) => {
            if (!instance.results || instance.results.length < 1){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:ready-transcript) => Instance is missing transcript results!")
            }

            utilities.runAsync(async () => {
                if (!instance.results || instance.results.length < 1){
                    instance.success = false
                    cancel()
                    throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:ready-transcript) => Instance is missing transcript results! (2)")
                }

                let editedPendingMessage = false
                for (const item of instance.results as TranscriptResultItem[]){
                    const {compiler,result} = item
                    await storeTranscriptHistory(result)
                    await opendiscord.events.get("onTranscriptReady").emit([opendiscord.transcripts,result.ticket,result.channel,result.user])

                    if (compiler.ready){
                        try{
                            const {channelMessage,creatorDmMessage,participantDmMessage,activeAdminDmMessage,everyAdminDmMessage} = await compiler.ready(result)
                            
                            if (transcriptConfig.data.general.enableChannel && channelMessage){
                                if (instance.pendingMessage && instance.pendingMessage.success && !editedPendingMessage){
                                    instance.pendingMessage.message.edit(utilities.getMessageFromBuildResult(channelMessage,"message"))
                                    editedPendingMessage = true
                                }else{
                                    const post = opendiscord.posts.get("opendiscord:transcripts")
                                    if (post) await post.send(channelMessage)
                                }
                            }

                            if (instance.participants){
                                for (const p of instance.participants){
                                    if (p.role == "creator" && transcriptConfig.data.general.enableCreatorDM && creatorDmMessage){
                                        await opendiscord.client.sendUserDm(p.user,creatorDmMessage)
                                    }else if (p.role == "participant" && transcriptConfig.data.general.enableParticipantDM && participantDmMessage){
                                        await opendiscord.client.sendUserDm(p.user,participantDmMessage)
                                    }else if (p.role == "admin" && transcriptConfig.data.general.enableActiveAdminDM && result.success && result.messages && result.messages.some((msg) => msg.author.id == p.user.id) && activeAdminDmMessage){
                                        await opendiscord.client.sendUserDm(p.user,activeAdminDmMessage)
                                    }else if (p.role == "admin" && transcriptConfig.data.general.enableEveryAdminDM && everyAdminDmMessage){
                                        await opendiscord.client.sendUserDm(p.user,everyAdminDmMessage)
                                    }
                                }
                            }
                        }catch(err){
                            instance.success = false
                            cancel()
                            process.emit("uncaughtException",err)
                            throw new api.ODSystemError("ODAction(ot:create-transcript) => Failed transcript compiler ready()! (see error above)")
                        }
                    }
                    await opendiscord.events.get("afterTranscriptReady").emit([opendiscord.transcripts,result.ticket,result.channel,result.user])
                }
            })

            const primaryResult = instance.result
            if (!primaryResult){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:ready-transcript) => Instance is missing primary transcript result!")
            }
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:transcripts-created",1,"increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:transcripts-created",params.user.id,1,"increase")
            await opendiscord.events.get("afterTranscriptCreated").emit([opendiscord.transcripts,primaryResult.ticket,primaryResult.channel,primaryResult.user])
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,origin,cancel) => {
            const {user,channel,ticket} = params

            opendiscord.log(user.displayName+" created a transcript!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"option",value:ticket.option.id.value},
                {key:"method",value:origin,hidden:true},
                {key:"compiler",value:(instance.results ? instance.results.map((item:TranscriptResultItem) => item.compiler.id.value).join(",") : instance.compiler?.id.value) ?? "<unknown-compiler>"},
            ])
        })
    ])
}
