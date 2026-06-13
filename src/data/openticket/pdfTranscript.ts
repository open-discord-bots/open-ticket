import {opendiscord, api, utilities} from "../../index.js"
import * as discord from "discord.js"
import PDFDocument = require("pdfkit")

type PdfConfig = api.ODTranscriptsJsonConfig_TranscriptsPdfLayout

export interface ODPdfTranscriptData {
    buffer:Buffer,
    fileName:string,
    warnings:string[]
}

interface DownloadState {
    totalBytes:number
}

const lang = opendiscord.languages

const safeText = (value:unknown) => String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"")

const fallback = (translation:string|null, value:string) => translation ?? value

const label = (key:string, value:string) => fallback(lang.getTranslation(key),value)

const formatDate = (timestamp:number|Date|null|undefined) => {
    if (!timestamp) return "/"
    return utilities.dateString(timestamp instanceof Date ? timestamp : new Date(timestamp))
}

const bytesToHuman = (bytes:number) => {
    const units = ["B","KB","MB","GB","TB"]
    let size = bytes
    let index = 0
    while (size >= 1024 && index < units.length-1){
        size = size/1024
        index++
    }
    return (index == 0 ? Math.round(size).toString() : size.toFixed(size >= 10 ? 1 : 2))+" "+units[index]
}

const maxBytes = (mb:number) => Math.max(0,mb)*1024*1024

const isDiscordAttachmentUrl = (url:string) => {
    try{
        const parsed = new URL(url)
        return parsed.protocol == "https:" && ["cdn.discordapp.com","media.discordapp.net"].includes(parsed.hostname)
    }catch{
        return false
    }
}

const isImageAttachment = (attachment:discord.Attachment) => {
    const contentType = attachment.contentType?.toLowerCase() ?? ""
    const name = attachment.name.toLowerCase()
    return ["image/png","image/jpeg","image/jpg","image/webp"].includes(contentType)
        || [".png",".jpg",".jpeg",".webp"].some((ext) => name.endsWith(ext))
}

const getTicketStatus = (ticket:api.ODTicket) => {
    if (ticket.get("opendiscord:for-deletion").value) return "Deleting"
    if (ticket.get("opendiscord:closed").value) return "Closed"
    if (ticket.get("opendiscord:open").value) return "Open"
    return "/"
}

const getUserLabel = (user:discord.User|null) => {
    if (!user) return "/"
    return `${safeText(user.displayName)} (${safeText(user.username)} / ${user.id})`
}

const ensureSpace = (doc:PDFKit.PDFDocument, height:number) => {
    const bottom = doc.page.height-doc.page.margins.bottom
    if (doc.y+height > bottom) doc.addPage()
}

const sectionTitle = (doc:PDFKit.PDFDocument, title:string) => {
    ensureSpace(doc,32)
    doc.moveDown(0.4)
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text(title)
    doc.moveTo(doc.page.margins.left,doc.y+4)
        .lineTo(doc.page.width-doc.page.margins.right,doc.y+4)
        .strokeColor("#d1d5db")
        .lineWidth(1)
        .stroke()
    doc.moveDown(0.8)
}

const keyValue = (doc:PDFKit.PDFDocument, key:string, value:string) => {
    ensureSpace(doc,18)
    const x = doc.page.margins.left
    const y = doc.y
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#374151").text(key,x,y,{width:150,continued:false})
    doc.font("Helvetica").fontSize(9).fillColor("#111827").text(safeText(value),x+160,y,{width:doc.page.width-doc.page.margins.right-x-160})
}

const bulletLine = (doc:PDFKit.PDFDocument, text:string) => {
    ensureSpace(doc,16)
    doc.font("Helvetica").fontSize(8).fillColor("#374151").text("- "+safeText(text),{
        width:doc.page.width-doc.page.margins.left-doc.page.margins.right,
        continued:false
    })
}

const addWarning = (warnings:string[], message:string) => {
    warnings.push(message)
    opendiscord.log(message,"warning")
}

const downloadAttachmentPreview = async (attachment:discord.Attachment, config:PdfConfig, state:DownloadState) => {
    if (!isDiscordAttachmentUrl(attachment.url)) throw new Error("Attachment URL is not a Discord CDN URL.")

    const perFileLimit = maxBytes(Math.min(config.maxImagePreviewSizeMB,config.maxAttachmentDownloadSizeMB))
    const totalLimit = maxBytes(config.maxTotalAttachmentDownloadSizeMB)
    if (attachment.size > perFileLimit) throw new Error("Attachment exceeds the configured image preview size limit.")
    if (state.totalBytes+attachment.size > totalLimit) throw new Error("Attachment previews exceed the configured total download size limit.")

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(),8000)
    try{
        const response = await fetch(attachment.url,{signal:controller.signal})
        if (!response.ok) throw new Error("Discord CDN returned HTTP "+response.status+".")

        const contentLength = Number(response.headers.get("content-length") ?? "0")
        if (contentLength && contentLength > perFileLimit) throw new Error("Downloaded file exceeds the configured image preview size limit.")
        if (contentLength && state.totalBytes+contentLength > totalLimit) throw new Error("Attachment previews exceed the configured total download size limit.")

        const buffer = Buffer.from(await response.arrayBuffer())
        if (buffer.length > perFileLimit) throw new Error("Downloaded file exceeds the configured image preview size limit.")
        if (state.totalBytes+buffer.length > totalLimit) throw new Error("Attachment previews exceed the configured total download size limit.")

        state.totalBytes += buffer.length
        return buffer
    }finally{
        clearTimeout(timeout)
    }
}

const renderAttachment = async (doc:PDFKit.PDFDocument, message:discord.Message<true>, attachment:discord.Attachment, config:PdfConfig, state:DownloadState, warnings:string[]) => {
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
    ensureSpace(doc,86)
    const x = doc.page.margins.left+12
    const y = doc.y
    const width = doc.page.width-doc.page.margins.left-doc.page.margins.right-24
    doc.roundedRect(x-6,y-4,width+12,76,4).fillAndStroke("#f9fafb","#e5e7eb")
    doc.y = y+5
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#111827").text(label("transcripts.pdf.attachments","Attachments"),x,doc.y,{width})
    bulletLine(doc,`${label("transcripts.pdf.filename","Filename")}: ${attachment.name}`)
    bulletLine(doc,`${label("transcripts.pdf.fileSize","File Size")}: ${bytesToHuman(attachment.size)}`)
    bulletLine(doc,`${label("transcripts.pdf.contentType","Content Type")}: ${attachment.contentType ?? "unknown"}`)
    bulletLine(doc,`${label("transcripts.pdf.uploadedBy","Uploaded By")}: ${message.author.username} (${message.author.id})`)
    bulletLine(doc,`${label("transcripts.pdf.sentAt","Sent At")}: ${formatDate(message.createdTimestamp)}`)
    if (attachment.spoiler) bulletLine(doc,"Spoiler: yes")
    if (config.showAttachmentUrls) bulletLine(doc,`URL: ${attachment.url}`)
    bulletLine(doc,`${label("transcripts.pdf.messageLink","Message Link")}: ${messageLink}`)

    if (config.embedImagePreviews && isImageAttachment(attachment)){
        try{
            const image = await downloadAttachmentPreview(attachment,config,state)
            ensureSpace(doc,170)
            doc.moveDown(0.4)
            doc.image(image,{
                fit:[260,150]
            })
            doc.moveDown(0.5)
        }catch(err){
            const reason = err instanceof Error ? err.message : "Unknown error."
            bulletLine(doc,`${label("transcripts.pdf.imagePreviewUnavailable","Image preview unavailable")}: ${reason}`)
            addWarning(warnings,`PDF transcript image preview skipped for ${attachment.name}: ${reason}`)
        }
    }
    doc.moveDown(0.8)
}

const renderEmbeds = (doc:PDFKit.PDFDocument, message:discord.Message<true>, config:PdfConfig) => {
    if (!config.includeEmbeds || message.embeds.length < 1) return
    ensureSpace(doc,32)
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#374151").text("Embeds")
    message.embeds.forEach((embed,index) => {
        const parts:string[] = []
        if (embed.title) parts.push("Title: "+embed.title)
        if (embed.description) parts.push("Description: "+embed.description)
        if (embed.url) parts.push("URL: "+embed.url)
        if (embed.author?.name) parts.push("Author: "+embed.author.name)
        if (embed.footer?.text) parts.push("Footer: "+embed.footer.text)
        if (embed.image?.url) parts.push("Image: "+embed.image.url)
        if (embed.thumbnail?.url) parts.push("Thumbnail: "+embed.thumbnail.url)
        if (embed.fields.length > 0) parts.push("Fields: "+embed.fields.map((field) => `${field.name}: ${field.value}`).join(" | "))
        bulletLine(doc,`Embed ${index+1}: ${parts.length > 0 ? parts.join(" | ") : "empty embed"}`)
    })
}

const renderStickers = (doc:PDFKit.PDFDocument, message:discord.Message<true>, config:PdfConfig) => {
    if (!config.includeStickers || message.stickers.size < 1) return
    ensureSpace(doc,28)
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#374151").text("Stickers")
    message.stickers.forEach((sticker) => {
        bulletLine(doc,`${sticker.name} (${sticker.id})${sticker.url ? " - "+sticker.url : ""}`)
    })
}

const renderMessage = async (doc:PDFKit.PDFDocument, message:discord.Message<true>, config:PdfConfig, state:DownloadState, warnings:string[]) => {
    ensureSpace(doc,96)
    const x = doc.page.margins.left
    const y = doc.y
    const width = doc.page.width-doc.page.margins.left-doc.page.margins.right

    doc.roundedRect(x,y,width,1,1).fill("#e5e7eb")
    doc.moveDown(0.7)
    const displayName = message.member?.displayName ?? message.author.displayName
    const botLabel = message.author.bot ? "bot" : (message.author.system ? "system" : "user")
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(`${safeText(displayName)} (${safeText(message.author.username)} / ${message.author.id})`,{width})
    doc.font("Helvetica").fontSize(8).fillColor("#6b7280").text(`${botLabel} - ${formatDate(message.createdTimestamp)} - Message ID: ${message.id}`,{width})
    if (message.editedTimestamp) doc.text(`Edited: ${formatDate(message.editedTimestamp)}`,{width})

    if (message.reference?.messageId){
        const replyText = `Reply/reference: guild=${message.reference.guildId ?? "/"} channel=${message.reference.channelId ?? "/"} message=${message.reference.messageId}`
        doc.font("Helvetica").fontSize(8).fillColor("#4b5563").text(replyText,{width})
    }

    const content = message.content ? safeText(message.content) : "<no text content>"
    doc.moveDown(0.35)
    doc.font("Helvetica").fontSize(9).fillColor("#111827").text(content,{width})

    renderEmbeds(doc,message,config)
    renderStickers(doc,message,config)

    if (message.attachments.size > 0 && config.includeAttachments){
        doc.moveDown(0.4)
        for (const attachment of message.attachments.values()){
            await renderAttachment(doc,message,attachment,config,state,warnings)
        }
    }else if (message.attachments.size > 0){
        doc.moveDown(0.4)
        message.attachments.forEach((attachment) => {
            bulletLine(doc,`Attachment metadata disabled by config: ${attachment.name} (${bytesToHuman(attachment.size)}) ${attachment.url}`)
        })
    }
}

const addPageNumbers = (doc:PDFKit.PDFDocument) => {
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start+range.count; i++){
        doc.switchToPage(i)
        doc.font("Helvetica").fontSize(8).fillColor("#6b7280")
            .text(`Page ${i+1} of ${range.count}`,doc.page.margins.left,doc.page.height-36,{
                align:"center",
                width:doc.page.width-doc.page.margins.left-doc.page.margins.right
            })
    }
}

export async function generatePdfTranscript(ticket:api.ODTicket, channel:discord.TextChannel, user:discord.User, rawMessages:discord.Message<true>[]): Promise<ODPdfTranscriptData> {
    const config = opendiscord.configs.get("opendiscord:transcripts").data.pdfTranscriptStyle
    const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
    const claimer = await opendiscord.tickets.getTicketUser(ticket,"claimer")
    const closer = await opendiscord.tickets.getTicketUser(ticket,"closer")
    const warnings:string[] = []
    const downloadState:DownloadState = {totalBytes:0}

    const doc = new PDFDocument({
        size:config.pageSize,
        margin:48,
        bufferPages:true,
        info:{
            Title:"Open Ticket PDF Transcript",
            Author:"Open Ticket"
        }
    })
    const chunks:Buffer[] = []
    doc.on("data",(chunk:Buffer) => chunks.push(chunk))

    const complete = new Promise<Buffer>((resolve,reject) => {
        doc.on("end",() => resolve(Buffer.concat(chunks)))
        doc.on("error",reject)
    })

    doc.font("Helvetica-Bold").fontSize(22).fillColor("#111827").text(label("transcripts.pdf.title","PDF Transcript"),{width:doc.page.width-doc.page.margins.left-doc.page.margins.right})
    doc.moveDown(0.3)
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(`Generated ${formatDate(Date.now())}`)

    sectionTitle(doc,"Ticket")
    keyValue(doc,"Server",`${channel.guild.name} (${channel.guild.id})`)
    keyValue(doc,"Channel",`#${channel.name} (${channel.id})`)
    keyValue(doc,"Ticket ID",ticket.id.value)
    keyValue(doc,"Ticket Owner",getUserLabel(creator))
    keyValue(doc,"Claimed Staff",getUserLabel(claimer))
    keyValue(doc,"Closed By",getUserLabel(closer))
    keyValue(doc,"Status",getTicketStatus(ticket))
    keyValue(doc,"Created",formatDate(ticket.get("opendiscord:opened-on").value))
    keyValue(doc,"Closed",formatDate(ticket.get("opendiscord:closed-on").value))
    keyValue(doc,"Deleted/Generated",formatDate(Date.now()))
    keyValue(doc,"Total Messages",rawMessages.length.toString())

    sectionTitle(doc,"Messages")
    if (rawMessages.length < 1){
        doc.font("Helvetica").fontSize(9).fillColor("#111827").text("No messages were found in this ticket channel.")
    }

    for (const message of rawMessages){
        try{
            await renderMessage(doc,message,config,downloadState,warnings)
        }catch(err){
            const reason = err instanceof Error ? err.message : "Unknown error."
            doc.font("Helvetica").fontSize(9).fillColor("#b91c1c").text(`Message ${message.id} could not be fully rendered: ${reason}`)
            addWarning(warnings,`PDF transcript message fallback rendered for ${message.id}: ${reason}`)
        }
    }

    if (warnings.length > 0){
        sectionTitle(doc,"Warnings")
        warnings.forEach((warning) => bulletLine(doc,warning))
    }

    addPageNumbers(doc)
    doc.end()

    const buffer = await complete
    return {
        buffer,
        fileName:`${channel.name || channel.id}.pdf`,
        warnings
    }
}
