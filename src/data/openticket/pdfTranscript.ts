import {opendiscord, api, utilities} from "../../index.js"
import * as discord from "discord.js"
import fs from "fs"
import PDFDocument = require("pdfkit")

const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")

export interface ODPdfArchiveFileData {
    name:string,
    buffer:Buffer,
    description:string,
    originalUrl:string,
    size:number
}

export interface ODPdfTranscriptData {
    buffer:Buffer,
    fileName:string,
    warnings:string[],
    archiveFiles:ODPdfArchiveFileData[]
}

interface ODPdfTranscriptConfig {
    enabled:boolean,
    includeEmbeds:boolean,
    includeStickers:boolean,
    branding:{
        enabled:boolean,
        title:string,
        subtitle:string,
        logoUrl:string,
        logoPath:string,
        showServerIcon:boolean,
        showBotBranding:boolean,
        footerText:string,
        watermarkText:string,
        showWatermark:boolean
    },
    colors:{
        primary:string,
        secondary:string,
        background:string,
        surface:string,
        headerBackground:string,
        headerText:string,
        text:string,
        mutedText:string,
        border:string,
        accent:string,
        success:string,
        warning:string,
        danger:string,
        attachmentBackground:string,
        attachmentBorder:string
    },
    layout:{
        pageSize:"A4"|"Letter",
        margins:{top:number,bottom:number,left:number,right:number},
        fontSize:number,
        messageSpacing:number,
        compactMode:boolean,
        showPageNumbers:boolean,
        showTimestamps:boolean,
        showUserIds:boolean,
        showMessageIds:boolean
    },
    attachments:{
        includeAttachmentMetadata:boolean,
        embedImagePreviews:boolean,
        maxImagePreviewSizeMB:number,
        maxAttachmentDownloadSizeMB:number,
        maxTotalAttachmentDownloadSizeMB:number,
        showAttachmentUrls:boolean,
        sendArchiveFilesSeparately:boolean,
        maxSeparateFileSizeMB:number,
        maxTotalSeparateFilesSizeMB:number,
        archiveExtensions:string[],
        archiveContentTypes:string[],
        fallbackToAttachmentLinks:boolean
    }
}

interface ODPdfGenerationState {
    warnings:string[],
    archiveFiles:ODPdfArchiveFileData[],
    totalImagePreviewBytes:number,
    totalSeparateArchiveBytes:number
}

const defaultArchiveExtensions = [".tar.gz",".tgz",".zip",".tar",".rar",".7z",".gz",".bz2",".xz"]
const defaultArchiveContentTypes = [
    "application/zip",
    "application/x-zip-compressed",
    "application/x-tar",
    "application/gzip",
    "application/x-gzip",
    "application/x-7z-compressed",
    "application/vnd.rar",
    "application/x-rar-compressed",
    "application/x-bzip2",
    "application/x-xz"
]

const imageContentTypes = new Set(["image/png","image/jpeg","image/jpg","image/webp"])
const imageExtensions = new Set([".png",".jpg",".jpeg",".webp"])

export async function generatePdfTranscript(ticket:api.ODTicket,channel:discord.GuildTextBasedChannel,user:discord.User,rawMessages:discord.Message[]): Promise<ODPdfTranscriptData> {
    const config = normalisePdfConfig(transcriptConfig.data.pdfTranscriptStyle)
    const state: ODPdfGenerationState = {
        warnings:[],
        archiveFiles:[],
        totalImagePreviewBytes:0,
        totalSeparateArchiveBytes:0
    }

    return new Promise<ODPdfTranscriptData>(async (resolve,reject) => {
        const chunks: Buffer[] = []
        const doc = new PDFDocument({
            size:config.layout.pageSize,
            margins:config.layout.margins,
            bufferPages:true,
            autoFirstPage:true,
            info:{
                Title:config.branding.title || "Ticket Transcript",
                Author:"Open Ticket",
                Subject:`Transcript for #${channel.name}`
            }
        })

        doc.on("data",(chunk:Buffer) => chunks.push(chunk))
        doc.on("error",reject)
        doc.on("end",() => {
            resolve({
                buffer:Buffer.concat(chunks),
                fileName:sanitizeFileName(`${channel.name || "ticket"}-transcript.pdf`),
                warnings:state.warnings,
                archiveFiles:state.archiveFiles
            })
        })

        try{
            await renderPdf(doc,config,state,ticket,channel,user,rawMessages)
            addPageFooters(doc,config)
            doc.end()
        }catch(err){
            reject(err)
        }
    })
}

const renderPdf = async (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,state:ODPdfGenerationState,ticket:api.ODTicket,channel:discord.GuildTextBasedChannel,user:discord.User,rawMessages:discord.Message[]) => {
    const orderedMessages = [...rawMessages].sort((a,b) => a.createdTimestamp-b.createdTimestamp)
    await renderHeader(doc,config,state,channel)
    renderMetadata(doc,config,ticket,channel,user,orderedMessages.length)

    if (config.branding.showWatermark && config.branding.watermarkText){
        renderWatermark(doc,config)
    }

    heading(doc,config,"Messages")
    if (orderedMessages.length == 0){
        paragraph(doc,config,"No messages were found in this ticket.",config.colors.mutedText)
        return
    }

    for (const message of orderedMessages){
        await renderMessage(doc,config,state,message)
    }
}

const renderHeader = async (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,state:ODPdfGenerationState,channel:discord.GuildTextBasedChannel) => {
    const top = doc.page.margins.top
    const left = doc.page.margins.left
    const width = doc.page.width-doc.page.margins.left-doc.page.margins.right
    const height = config.branding.enabled ? 88 : 48

    doc.save()
    doc.rect(left,top,width,height).fill(config.colors.headerBackground)
    doc.fillColor(config.colors.headerText)

    let textLeft = left+18
    const logo = await getBrandLogo(config,state,channel.guild)
    if (logo){
        try{
            doc.image(logo,left+16,top+16,{fit:[52,52]})
            textLeft += 66
        }catch{
            addWarning(state,"Logo could not be rendered in the PDF header.")
        }
    }

    doc.font("Helvetica-Bold").fontSize(18).text(config.branding.title || "Ticket Transcript",textLeft,top+18,{width:width-(textLeft-left)-16})
    if (config.branding.subtitle){
        doc.font("Helvetica").fontSize(10).fillColor(config.colors.headerText).text(config.branding.subtitle,textLeft,top+43,{width:width-(textLeft-left)-16})
    }
    doc.font("Helvetica").fontSize(9).fillColor(config.colors.headerText).text(`#${channel.name}`,textLeft,top+62,{width:width-(textLeft-left)-16})
    doc.restore()
    doc.y = top+height+18
}

const renderMetadata = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,ticket:api.ODTicket,channel:discord.GuildTextBasedChannel,user:discord.User,messageCount:number) => {
    const creatorId = ticket.get("opendiscord:opened-by").value
    const claimerId = ticket.get("opendiscord:claimed-by").value
    const openedOn = ticket.get("opendiscord:opened-on").value
    const closedOn = ticket.get("opendiscord:closed-on").value
    const status = ticket.get("opendiscord:status")?.value ?? ticket.get("opendiscord:state")?.value

    const metadata = [
        ["Server",channel.guild.name],
        ["Ticket Channel","#"+channel.name],
        ["Ticket ID",ticket.id.value],
        ["Ticket Owner",creatorId ? `<@${creatorId}> (${creatorId})` : "Unknown"],
        ["Claimed Staff",claimerId ? `<@${claimerId}> (${claimerId})` : "Not claimed"],
        ["Ticket Status",status ? String(status) : "Unknown"],
        ["Created",openedOn ? formatDate(new Date(openedOn)) : "Unknown"],
        ["Closed/Deleted",closedOn ? formatDate(new Date(closedOn)) : formatDate(new Date())],
        ["Generated",formatDate(new Date())],
        ["Generated By",`${user.displayName} (${user.username}, ${user.id})`],
        ["Total Messages",String(messageCount)]
    ]

    heading(doc,config,"Ticket Details")
    const startX = doc.page.margins.left
    const labelWidth = 112
    const valueWidth = doc.page.width-doc.page.margins.left-doc.page.margins.right-labelWidth
    for (const [label,value] of metadata){
        ensureSpace(doc,config,20)
        const y = doc.y
        doc.font("Helvetica-Bold").fontSize(config.layout.fontSize).fillColor(config.colors.secondary).text(label,startX,y,{width:labelWidth})
        doc.font("Helvetica").fontSize(config.layout.fontSize).fillColor(config.colors.text).text(safeText(value),startX+labelWidth,y,{width:valueWidth})
        doc.y = Math.max(doc.y,y+18)
    }
    doc.moveDown(0.8)
}

const renderMessage = async (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,state:ODPdfGenerationState,message:discord.Message) => {
    ensureSpace(doc,config,72)
    const x = doc.page.margins.left
    const width = doc.page.width-doc.page.margins.left-doc.page.margins.right
    const top = doc.y

    doc.save()
    doc.roundedRect(x,top,width,Math.max(config.layout.compactMode ? 42 : 54,14),4).fill(config.colors.surface)
    doc.restore()
    doc.y = top+9

    const authorName = message.member?.displayName ?? message.author.displayName ?? message.author.username
    const botLabel = message.author.bot ? " [BOT]" : ""
    const idText = config.layout.showUserIds ? ` (${message.author.username}, ${message.author.id})` : ` (${message.author.username})`
    doc.font("Helvetica-Bold").fontSize(config.layout.fontSize+1).fillColor(config.colors.secondary).text(`${authorName}${botLabel}`,x+10,doc.y,{width:width-20,continued:false})
    doc.font("Helvetica").fontSize(config.layout.fontSize-1).fillColor(config.colors.mutedText).text(idText,x+10,doc.y,{width:width-20})

    const meta: string[] = []
    if (config.layout.showTimestamps) meta.push(formatDate(message.createdAt))
    if (message.editedAt) meta.push(`edited ${formatDate(message.editedAt)}`)
    if (config.layout.showMessageIds) meta.push(`message ${message.id}`)
    if (meta.length > 0) doc.font("Helvetica").fontSize(config.layout.fontSize-1).fillColor(config.colors.mutedText).text(meta.join(" | "),x+10,doc.y,{width:width-20})

    const reference = await getMessageReference(message)
    if (reference) blockLine(doc,config,"Reply",reference)

    if (message.content){
        paragraph(doc,config,message.content,config.colors.text,x+10,width-20)
    }else if (message.attachments.size == 0 && message.embeds.length == 0 && message.stickers.size == 0){
        paragraph(doc,config,"[No text content]",config.colors.mutedText,x+10,width-20)
    }

    if (config.includeEmbeds && message.embeds.length > 0){
        renderEmbeds(doc,config,message.embeds,x+10,width-20)
    }else if (!config.includeEmbeds && message.embeds.length > 0){
        blockLine(doc,config,"Skipped",`${message.embeds.length} embed(s) hidden by PDF config.`,x+10,width-20)
    }

    if (config.includeStickers && message.stickers.size > 0){
        renderStickers(doc,config,message.stickers,x+10,width-20)
    }else if (!config.includeStickers && message.stickers.size > 0){
        blockLine(doc,config,"Skipped",`${message.stickers.size} sticker(s) hidden by PDF config.`,x+10,width-20)
    }

    if (config.attachments.includeAttachmentMetadata && message.attachments.size > 0){
        for (const attachment of message.attachments.values()){
            await renderAttachment(doc,config,state,message,attachment,x+10,width-20)
        }
    }else if (!config.attachments.includeAttachmentMetadata && message.attachments.size > 0){
        blockLine(doc,config,"Skipped",`${message.attachments.size} attachment(s) hidden by PDF config.`,x+10,width-20)
    }

    doc.moveDown(config.layout.compactMode ? 0.35 : 0.7)
    doc.y += config.layout.messageSpacing
}

const renderEmbeds = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,embeds:discord.Embed[],x:number,width:number) => {
    embeds.forEach((embed,index) => {
        const parts = [
            embed.title ? `Title: ${embed.title}` : "",
            embed.description ? `Description: ${embed.description}` : "",
            embed.url ? `URL: ${embed.url}` : "",
            embed.fields.length > 0 ? `Fields: ${embed.fields.map((field) => `${field.name}: ${field.value}`).join(" | ")}` : ""
        ].filter(Boolean)
        blockLine(doc,config,`Embed ${index+1}`,parts.length > 0 ? parts.join("\n") : "Embed was present but had no renderable text.",x,width)
    })
}

const renderStickers = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,stickers:discord.Collection<string,discord.Sticker>,x:number,width:number) => {
    stickers.forEach((sticker) => {
        blockLine(doc,config,"Sticker",`${sticker.name} (${sticker.id})`,x,width)
    })
}

const renderAttachment = async (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,state:ODPdfGenerationState,message:discord.Message,attachment:discord.Attachment,x:number,width:number) => {
    ensureSpace(doc,config,74)
    const contentType = attachment.contentType ?? "Unknown"
    const isSpoiler = attachment.spoiler || attachment.name.startsWith("SPOILER_")
    const lines = [
        `Filename: ${attachment.name}`,
        `File Size: ${bytesToHuman(attachment.size)}`,
        `Content Type: ${contentType}`,
        `Uploaded By: ${message.author.username} (${message.author.id})`,
        `Sent At: ${formatDate(message.createdAt)}`,
        `Spoiler: ${isSpoiler ? "Yes" : "No"}`
    ]
    const messageLink = getMessageLink(message)
    if (messageLink) lines.push(`Message Link: ${messageLink}`)
    if (config.attachments.showAttachmentUrls) lines.push(`URL: ${attachment.url}`)

    const archive = isArchiveAttachment(config,attachment)
    if (archive) lines.push("Archive Attachment: listed here and queued for separate delivery when size limits allow.")

    doc.save()
    const boxTop = doc.y
    doc.roundedRect(x,boxTop,width,18,4).fill(config.colors.attachmentBackground).stroke(config.colors.attachmentBorder)
    doc.restore()
    doc.font("Helvetica-Bold").fontSize(config.layout.fontSize).fillColor(config.colors.secondary).text(archive ? "Archive Attachment" : "Attachment",x+8,boxTop+5,{width:width-16})
    doc.y = boxTop+25
    paragraph(doc,config,lines.join("\n"),config.colors.text,x+8,width-16)

    if (archive && config.attachments.sendArchiveFilesSeparately){
        await queueArchiveAttachment(config,state,attachment,message)
    }

    if (config.attachments.embedImagePreviews && isImageAttachment(attachment)){
        await renderImagePreview(doc,config,state,attachment,x+8,Math.min(width-16,360))
    }
}

const queueArchiveAttachment = async (config:ODPdfTranscriptConfig,state:ODPdfGenerationState,attachment:discord.Attachment,message:discord.Message) => {
    if (!isDiscordAttachmentUrl(attachment.url)){
        addWarning(state,`Archive attachment "${attachment.name}" was not forwarded because the URL was not a Discord attachment URL.`)
        return
    }
    const maxFileBytes = Math.min(mbToBytes(config.attachments.maxSeparateFileSizeMB),mbToBytes(config.attachments.maxAttachmentDownloadSizeMB))
    const maxTotalBytes = mbToBytes(config.attachments.maxTotalSeparateFilesSizeMB)
    if (attachment.size > maxFileBytes){
        addWarning(state,`Archive attachment "${attachment.name}" was not forwarded because it exceeds ${bytesToHuman(maxFileBytes)}.`)
        return
    }
    if (state.totalSeparateArchiveBytes+attachment.size > maxTotalBytes){
        addWarning(state,`Archive attachment "${attachment.name}" was not forwarded because archive forwarding reached ${bytesToHuman(maxTotalBytes)}.`)
        return
    }

    try{
        const buffer = await downloadUrlBuffer(attachment.url,maxFileBytes,15000)
        if (state.totalSeparateArchiveBytes+buffer.length > maxTotalBytes){
            addWarning(state,`Archive attachment "${attachment.name}" was downloaded but skipped because archive forwarding reached ${bytesToHuman(maxTotalBytes)}.`)
            return
        }
        state.totalSeparateArchiveBytes += buffer.length
        state.archiveFiles.push({
            name:sanitizeFileName(attachment.name),
            buffer,
            originalUrl:attachment.url,
            size:buffer.length,
            description:`Archive attachment from ${message.author.username} at ${formatDate(message.createdAt)}`
        })
    }catch{
        addWarning(state,`Archive attachment "${attachment.name}" could not be downloaded and was left as metadata/URL in the PDF.`)
    }
}

const renderImagePreview = async (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,state:ODPdfGenerationState,attachment:discord.Attachment,x:number,width:number) => {
    if (!isDiscordAttachmentUrl(attachment.url)){
        blockLine(doc,config,"Image preview unavailable","Attachment URL was not a Discord attachment URL.",x,width)
        return
    }

    const maxImageBytes = mbToBytes(config.attachments.maxImagePreviewSizeMB)
    const maxTotalBytes = mbToBytes(config.attachments.maxTotalAttachmentDownloadSizeMB)
    if (attachment.size > maxImageBytes){
        blockLine(doc,config,"Image preview unavailable",`Image exceeds preview limit of ${bytesToHuman(maxImageBytes)}.`,x,width)
        return
    }
    if (state.totalImagePreviewBytes+attachment.size > maxTotalBytes){
        blockLine(doc,config,"Image preview unavailable",`Total image preview download limit of ${bytesToHuman(maxTotalBytes)} was reached.`,x,width)
        return
    }

    try{
        const buffer = await downloadUrlBuffer(attachment.url,maxImageBytes,12000)
        state.totalImagePreviewBytes += buffer.length
        ensureSpace(doc,config,170)
        doc.image(buffer,x,doc.y,{fit:[width,160]})
        doc.moveDown(0.4)
    }catch{
        blockLine(doc,config,"Image preview unavailable","The image could not be downloaded or rendered. Metadata and URL are still included.",x,width)
    }
}

const addPageFooters = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig) => {
    const pages = doc.bufferedPageRange()
    for (let i = pages.start; i < pages.start+pages.count; i++){
        doc.switchToPage(i)
        const footerY = doc.page.height-doc.page.margins.bottom+12
        const width = doc.page.width-doc.page.margins.left-doc.page.margins.right
        doc.font("Helvetica").fontSize(8).fillColor(config.colors.mutedText)
        const leftText = config.branding.showBotBranding ? (config.branding.footerText || "Open Ticket Transcript") : config.branding.footerText
        if (leftText) doc.text(leftText,doc.page.margins.left,footerY,{width:width/2,lineBreak:false})
        if (config.layout.showPageNumbers) doc.text(`Page ${i-pages.start+1} of ${pages.count}`,doc.page.margins.left,footerY,{width,align:"right",lineBreak:false})
    }
}

const renderWatermark = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig) => {
    doc.save()
    doc.opacity(0.06)
    doc.rotate(-35,{origin:[doc.page.width/2,doc.page.height/2]})
    doc.font("Helvetica-Bold").fontSize(56).fillColor(config.colors.secondary).text(config.branding.watermarkText,0,doc.page.height/2,{width:doc.page.width,align:"center"})
    doc.restore()
}

const getBrandLogo = async (config:ODPdfTranscriptConfig,state:ODPdfGenerationState,guild:discord.Guild): Promise<Buffer|null> => {
    if (!config.branding.enabled) return null
    if (config.branding.logoPath){
        try{
            const stat = fs.statSync(config.branding.logoPath)
            if (stat.size <= mbToBytes(2)) return fs.readFileSync(config.branding.logoPath)
            addWarning(state,"Configured PDF logo path was larger than 2 MB and was skipped.")
        }catch{
            addWarning(state,"Configured PDF logo path could not be read.")
        }
    }
    if (config.branding.logoUrl && isHttpsUrl(config.branding.logoUrl)){
        try{
            return await downloadUrlBuffer(config.branding.logoUrl,mbToBytes(2),8000)
        }catch{
            addWarning(state,"Configured PDF logo URL could not be downloaded.")
        }
    }
    if (config.branding.showServerIcon){
        const iconUrl = guild.iconURL({extension:"png",size:128})
        if (iconUrl){
            try{
                return await downloadUrlBuffer(iconUrl,mbToBytes(2),8000)
            }catch{}
        }
    }
    return null
}

const getMessageReference = async (message:discord.Message): Promise<string|null> => {
    if (!message.reference) return null
    const parts: string[] = []
    if (message.reference.messageId) parts.push(`message ${message.reference.messageId}`)
    if (message.reference.channelId) parts.push(`channel ${message.reference.channelId}`)
    if (message.reference.guildId) parts.push(`guild ${message.reference.guildId}`)
    if (parts.length == 0) return "This message is a reply/reference, but no reference IDs were available."
    return parts.join(", ")
}

const heading = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,text:string) => {
    ensureSpace(doc,config,36)
    doc.font("Helvetica-Bold").fontSize(config.layout.fontSize+4).fillColor(config.colors.primary).text(text,doc.page.margins.left,doc.y)
    doc.moveDown(0.4)
}

const paragraph = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,text:string,color:string,x = doc.page.margins.left,width = doc.page.width-doc.page.margins.left-doc.page.margins.right) => {
    const safe = safeText(text)
    const height = doc.heightOfString(safe,{width})
    ensureSpace(doc,config,Math.min(Math.max(height,16),180))
    doc.font("Helvetica").fontSize(config.layout.fontSize).fillColor(color).text(safe,x,doc.y,{width})
    doc.moveDown(0.3)
}

const blockLine = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,label:string,text:string,x = doc.page.margins.left,width = doc.page.width-doc.page.margins.left-doc.page.margins.right) => {
    const safe = safeText(text)
    const estimated = doc.heightOfString(safe,{width:width-10})+26
    ensureSpace(doc,config,Math.min(Math.max(estimated,36),180))
    const top = doc.y
    doc.save()
    doc.roundedRect(x,top,width,Math.max(estimated,34),4).stroke(config.colors.border)
    doc.restore()
    doc.font("Helvetica-Bold").fontSize(config.layout.fontSize-1).fillColor(config.colors.accent).text(label,x+8,top+7,{width:width-16})
    doc.font("Helvetica").fontSize(config.layout.fontSize-1).fillColor(config.colors.text).text(safe,x+8,doc.y+2,{width:width-16})
    doc.y = Math.max(doc.y,top+Math.max(estimated,34)+5)
}

const ensureSpace = (doc:PDFKit.PDFDocument,config:ODPdfTranscriptConfig,requiredHeight:number) => {
    const reservedFooter = config.layout.showPageNumbers ? 18 : 0
    const bottom = doc.page.height-doc.page.margins.bottom-reservedFooter
    const top = doc.page.margins.top
    if (doc.y+requiredHeight <= bottom) return
    if (doc.y <= top+8) return
    doc.addPage()
}

const normalisePdfConfig = (raw:any): ODPdfTranscriptConfig => {
    const branding = raw?.branding ?? {}
    const colors = raw?.colors ?? {}
    const layout = raw?.layout ?? {}
    const margins = layout?.margins ?? {}
    const attachments = raw?.attachments ?? {}

    return {
        enabled:raw?.enabled ?? false,
        includeEmbeds:raw?.includeEmbeds ?? true,
        includeStickers:raw?.includeStickers ?? true,
        branding:{
            enabled:branding.enabled ?? true,
            title:asString(branding.title,"Ticket Transcript"),
            subtitle:asString(branding.subtitle,"Generated by Open Ticket"),
            logoUrl:asString(branding.logoUrl,""),
            logoPath:asString(branding.logoPath,""),
            showServerIcon:branding.showServerIcon ?? true,
            showBotBranding:branding.showBotBranding ?? true,
            footerText:asString(branding.footerText,"Open Ticket Transcript"),
            watermarkText:asString(branding.watermarkText,""),
            showWatermark:branding.showWatermark ?? false
        },
        colors:{
            primary:asHex(colors.primary,"#5865F2"),
            secondary:asHex(colors.secondary,"#2B2D31"),
            background:asHex(colors.background,"#FFFFFF"),
            surface:asHex(colors.surface,"#F2F3F5"),
            headerBackground:asHex(colors.headerBackground,"#5865F2"),
            headerText:asHex(colors.headerText,"#FFFFFF"),
            text:asHex(colors.text,"#111111"),
            mutedText:asHex(colors.mutedText,"#666666"),
            border:asHex(colors.border,"#DADDE1"),
            accent:asHex(colors.accent,"#5865F2"),
            success:asHex(colors.success,"#57F287"),
            warning:asHex(colors.warning,"#FEE75C"),
            danger:asHex(colors.danger,"#ED4245"),
            attachmentBackground:asHex(colors.attachmentBackground,"#F8F9FA"),
            attachmentBorder:asHex(colors.attachmentBorder,"#DADDE1")
        },
        layout:{
            pageSize:(layout.pageSize ?? raw?.pageSize) == "Letter" ? "Letter" : "A4",
            margins:{
                top:asNumber(margins.top,40,10,120),
                bottom:asNumber(margins.bottom,45,10,120),
                left:asNumber(margins.left,40,10,120),
                right:asNumber(margins.right,40,10,120)
            },
            fontSize:asNumber(layout.fontSize,10,7,16),
            messageSpacing:asNumber(layout.messageSpacing,10,0,40),
            compactMode:layout.compactMode ?? false,
            showPageNumbers:layout.showPageNumbers ?? true,
            showTimestamps:layout.showTimestamps ?? true,
            showUserIds:layout.showUserIds ?? true,
            showMessageIds:layout.showMessageIds ?? false
        },
        attachments:{
            includeAttachmentMetadata:attachments.includeAttachmentMetadata ?? raw?.includeAttachments ?? true,
            embedImagePreviews:attachments.embedImagePreviews ?? raw?.embedImagePreviews ?? true,
            maxImagePreviewSizeMB:asNumber(attachments.maxImagePreviewSizeMB ?? raw?.maxImagePreviewSizeMB,5,0.1,25),
            maxAttachmentDownloadSizeMB:asNumber(attachments.maxAttachmentDownloadSizeMB ?? raw?.maxAttachmentDownloadSizeMB,8,0.1,100),
            maxTotalAttachmentDownloadSizeMB:asNumber(attachments.maxTotalAttachmentDownloadSizeMB ?? raw?.maxTotalAttachmentDownloadSizeMB,25,0.1,250),
            showAttachmentUrls:attachments.showAttachmentUrls ?? raw?.showAttachmentUrls ?? true,
            sendArchiveFilesSeparately:attachments.sendArchiveFilesSeparately ?? true,
            maxSeparateFileSizeMB:asNumber(attachments.maxSeparateFileSizeMB,25,0.1,100),
            maxTotalSeparateFilesSizeMB:asNumber(attachments.maxTotalSeparateFilesSizeMB,50,0.1,250),
            archiveExtensions:Array.isArray(attachments.archiveExtensions) ? attachments.archiveExtensions.map((ext:any) => String(ext).toLowerCase()).sort((a:string,b:string) => b.length-a.length) : defaultArchiveExtensions,
            archiveContentTypes:Array.isArray(attachments.archiveContentTypes) ? attachments.archiveContentTypes.map((type:any) => String(type).toLowerCase()) : defaultArchiveContentTypes,
            fallbackToAttachmentLinks:attachments.fallbackToAttachmentLinks ?? true
        }
    }
}

const isArchiveAttachment = (config:ODPdfTranscriptConfig,attachment:discord.Attachment) => {
    const name = attachment.name.toLowerCase()
    const type = (attachment.contentType ?? "").toLowerCase().split(";")[0]
    return config.attachments.archiveExtensions.some((ext) => name.endsWith(ext)) || config.attachments.archiveContentTypes.includes(type)
}

const isImageAttachment = (attachment:discord.Attachment) => {
    const type = (attachment.contentType ?? "").toLowerCase().split(";")[0]
    const name = attachment.name.toLowerCase()
    return imageContentTypes.has(type) || [...imageExtensions].some((ext) => name.endsWith(ext))
}

const downloadUrlBuffer = async (url:string,limitBytes:number,timeoutMs:number): Promise<Buffer> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(),timeoutMs)
    try{
        const response = await fetch(url,{signal:controller.signal})
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const contentLength = Number(response.headers.get("content-length") ?? "0")
        if (contentLength && contentLength > limitBytes) throw new Error("file too large")
        if (!response.body) throw new Error("empty response body")

        const reader = response.body.getReader()
        const chunks: Buffer[] = []
        let received = 0
        while (true){
            const {done,value} = await reader.read()
            if (done) break
            received += value.length
            if (received > limitBytes){
                await reader.cancel()
                throw new Error("file too large")
            }
            chunks.push(Buffer.from(value))
        }
        return Buffer.concat(chunks)
    }finally{
        clearTimeout(timeout)
    }
}

const isDiscordAttachmentUrl = (url:string) => {
    try{
        const parsed = new URL(url)
        return parsed.protocol == "https:" && (
            parsed.hostname == "cdn.discordapp.com" ||
            parsed.hostname == "media.discordapp.net" ||
            parsed.hostname.endsWith(".discordapp.net")
        )
    }catch{
        return false
    }
}

const isHttpsUrl = (url:string) => {
    try{
        return new URL(url).protocol == "https:"
    }catch{
        return false
    }
}

const getMessageLink = (message:discord.Message) => {
    if (!message.guildId || !message.channelId || !message.id) return null
    return `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`
}

const addWarning = (state:ODPdfGenerationState,warning:string) => {
    if (!state.warnings.includes(warning)) state.warnings.push(warning)
}

const bytesToHuman = (bytes:number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
    const units = ["B","KB","MB","GB"]
    let value = bytes
    let unitIndex = 0
    while (value >= 1024 && unitIndex < units.length-1){
        value /= 1024
        unitIndex++
    }
    return `${value.toFixed(value >= 10 || unitIndex == 0 ? 0 : 1)} ${units[unitIndex]}`
}

const mbToBytes = (mb:number) => Math.floor(mb*1024*1024)
const formatDate = (date:Date) => utilities.dateString(date)
const safeText = (text:string) => String(text ?? "").replace(/\u0000/g,"").slice(0,12000)
const sanitizeFileName = (name:string) => name.replace(/[<>:"/\\|?*\u0000-\u001F]/g,"_").slice(0,120) || "transcript.pdf"
const asString = (value:any,fallback:string) => typeof value == "string" ? value : fallback
const asHex = (value:any,fallback:string) => typeof value == "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
const asNumber = (value:any,fallback:number,min:number,max:number) => {
    const num = Number(value)
    if (!Number.isFinite(num)) return fallback
    return Math.min(Math.max(num,min),max)
}
