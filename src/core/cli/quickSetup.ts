import {opendiscord, api, utilities} from "../../index"
import {Terminal, terminal} from "terminal-kit"
import ansis from "ansis"
import * as discord from "discord.js"
import {renderHeader} from "./cli"

interface ODQuickSetupVariables {
    client?:api.ODClientManager,
    guild?:discord.Guild,
    globalAdmins?:string[],
    mainColor?:discord.ColorResolvable,
    language?:string,
    slashCommands?:boolean,
    textCommands?:boolean,
    status?:api.ODJsonConfig_DefaultStatusType
}
const quickSetupStorage: ODQuickSetupVariables = {}
const autoCompleteMenuOpts: Terminal.SingleLineMenuOptions = {
    style:terminal.white,
    selectedStyle:terminal.bgBlue.white
}
const presetColors = new Map<string,number>([
    ["dark red",discord.Colors.DarkRed],
    ["red",0xff0000],
    ["light red",0xf06c6c],
    ["dark orange",0xed510e],
    ["orange",0xed6f0e],
    ["light orange",0xf0b06c],
    ["openticket",0xf8ba00],
    ["dark yellow",0xdeb100],
    ["yellow",0xffff00],
    ["light yellow",0xffff8c],
    ["banana",0xffe896],
    ["lime",0xa8e312],
    ["dark green",0x009600],
    ["green",0x00ff00],
    ["light green",0x76f266],
    ["dark cyan",0x00abab],
    ["cyan",0x00ffff],
    ["light cyan",0x63ffff],
    ["aquamarine",0x7fffd4],
    ["dark skyblue",0x006bc9],
    ["skyblue",0x0095ff],
    ["light skyblue",0x40bfff],
    ["dark blue",0x00006e],
    ["blue",0x0000ff],
    ["light blue",0x5353fc],
    ["blurple",0x5865F2],
    ["dark purple",0x3f009e],
    ["purple",0x8000ff],
    ["light purple",0x9257eb],
    ["dark pink",0xb82ab0],
    ["pink",0xff6bf8],
    ["light pink",0xff9cfa],
    ["magenta",0xff00ff],
    ["black",0x000000],
    ["brown",0x806050],
    ["dark gray",0x4f4f4f],
    ["gray",0x808080],
    ["light gray",0xb3b3b3],
    ["white",0xffffff],
    ["invisible",0x393A41]
])

export async function renderQuickSetup(backFn:() => api.ODPromiseVoid){
    if (quickSetupRequiresReset()) await renderQuickSetupWarning(backFn)
    else await renderQuickSetupWelcome(backFn)
}

function quickSetupRequiresReset(): boolean {
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (generalConfig.data.token != "your bot token here! (or leave empty when using 'tokenFromENV')") return true
    if (generalConfig.data.mainColor != "#f8ba00") return true
    if (generalConfig.data.language != "english") return true
    if (generalConfig.data.prefix != "!ticket ") return true
    if (generalConfig.data.serverId != "discord server id") return true

    return false
}

async function renderQuickSetupWarning(backFn:() => api.ODPromiseVoid) {
    renderHeader("⏱️ Open Ticket Quick Setup: Warning")

    terminal.bold(ansis.yellow("WARNING! ")+ansis.red("By using the 'Quick Setup' feature, your current config will be completely resetted!"))
    terminal.gray("\n\nAre you sure you want to continue?")

    const answer = await terminal.singleColumnMenu([
        ansis.green("✅ No, take me back."),
        ansis.red("🚨 Yes, continue and reset the config.")
    ],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled || answer.selectedIndex == 0) return await backFn()
    if (answer.selectedIndex == 1) await renderQuickSetupWelcome(async () => {await renderQuickSetupWarning(backFn)})
}

async function renderQuickSetupWelcome(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Introduction")

    terminal.bold.underline.blue("Open Ticket: Quick Setup\n")
    terminal.gray([
        "Hi there! Thank you for downloading and installing Open Ticket.",
        "You have chosen to configure the bot using the 'Quick Setup CLI'.",
        "",
        "This program will help you with configuring Open Ticket using a step-by-step method.",
        "If you've ever used Google Forms, then this will probably be very easy for you 😉.",
        "",
        ansis.magenta("The configuration should normally only take around 5 minutes."),
        ansis.magenta("Once you've completed the form, the bot is technically ready for usage!")
    ].join("\n")+"\n\n")

    const answer = await terminal.singleColumnMenu([
        ansis.green("Press 'Enter' to start!")
    ],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (answer.canceled) return await backFn()
    else if (answer.selectedIndex == 0) await renderQuickSetupDevPortal(async () => {await renderQuickSetupWelcome(backFn)})
}

async function renderQuickSetupDevPortal(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Discord Bot & Developer Portal")

    terminal.bold.blue("(Step 1) Have you already created a Discord bot to use for Open Ticket?\n")

    const answer = await terminal.singleColumnMenu([
        "✅ Yes I have, and it has been invited to the server.",
        "❓ No not yet, I don't know how to create one.",
        "👶 I've never seen a Discord bot before.",
    ],{
        leftPadding:"> ",
        style:terminal.gray,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (answer.canceled) return await backFn()
    else if (answer.selectedIndex == 0) await renderQuickSetupBotToken(async () => {await renderQuickSetupDevPortal(backFn)})
    else if (answer.selectedIndex == 1) await renderQuickSetupDevPortalGuide(0,async () => {await renderQuickSetupDevPortal(backFn)})
    else if (answer.selectedIndex == 2) await renderQuickSetupDevPortalGuide(1,async () => {await renderQuickSetupDevPortal(backFn)})
}

async function renderQuickSetupDevPortalGuide(variation:0|1,backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Discord Bot & Developer Portal")

    if (variation == 0){
        terminal.bold.blue("(Step 1.1) You've mentioned that you don't know how to create a Discord bot.\n\n")
        terminal.gray("Please visit the following URL for a step-by-step guide on how to create a Discord bot.\nIf it still doesn't work, join our Discord server and we will help you further!\n"+ansis.magenta("=> https://otdocs.dj-dj.be/docs/guides/get-started#bot\n\n"))
    }else{
        terminal.bold.blue("(Step 1.2) You've mentioned that you've never seen Discord bot before.\n\n")
        terminal.gray("How did you even download Open Ticket 🤪? But all jokes aside, we have a step-by-step guide on how to create a Discord bot.\nIf it still doesn't work, join our Discord server and we will help you further!\n"+ansis.magenta("=> https://otdocs.dj-dj.be/docs/guides/get-started#bot\n\n"))
    }

    const answer = await terminal.singleColumnMenu([
        ansis.green("✅ Alright, I've made the bot. Take me back please!")
    ],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    return await backFn()
}

async function quickSetupLogin(token:string): Promise<api.ODClientManager|null> {
    const client = new api.ODClientManager(opendiscord.debug)
    client.token = token
    client.intents.push("Guilds","GuildMessages","DirectMessages","GuildEmojisAndStickers","GuildMembers","MessageContent","GuildWebhooks","GuildInvites")
    client.privileges.push("MessageContent","GuildMembers")
    client.partials.push("Channel","Message")
    client.permissions.push("AddReactions","AttachFiles","CreatePrivateThreads","CreatePublicThreads","EmbedLinks","ManageChannels","ManageGuild","ManageMessages","ChangeNickname","ManageRoles","ManageThreads","ManageWebhooks","MentionEveryone","ReadMessageHistory","SendMessages","SendMessagesInThreads","UseApplicationCommands","UseExternalEmojis","ViewAuditLog","ViewChannel")
    client.initClient()

    //client login
    return new Promise(async (resolve) => {
        try{
            client.readyListener = async () => {
                client.activity.setStatus("custom","Configuring Open Ticket...","idle",true)
                resolve(client)
            }
            const success = await client.login(true)
            if (!success) resolve(null)
        }catch(err){
            resolve(null)
        }
    })
}

async function renderQuickSetupBotToken(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Bot Token")

    terminal.bold.blue("(Step 2) Please insert the token of your discord bot.\n")
    terminal.gray("It will be safely stored in the 'config/general.json' file.\n\n> ")

    const answer = await terminal.inputField({
        style:terminal.white,
        hintStyle:terminal.gray,
        cancelable:true
    }).promise

    if (typeof answer != "string") return await backFn()
    else{
        const result = await quickSetupLogin(answer)
        if (!result){
            //login failure
            terminal.red.bold("\n\n❌ Something went wrong with logging into the bot.\n")
            terminal.gray("Please try again and check your token for any mistakes.\nAlso make sure the permissions and priviliged gateaway intents are configured correctly in the developer panel.")
            await utilities.timer(3000)
            //retry
            await renderQuickSetupBotToken(backFn)
        }else{
            //login success
            terminal.green.bold("\n\n✅ Succesfully logged into the bot.\n")
            terminal.gray("Your bot should be online with the status 'Configuring Open Ticket...'.")
            await utilities.timer(3000)
            //continue
            quickSetupStorage.client = result
            await renderQuickSetupServer(async () => {await renderQuickSetupBotToken(backFn)})
        }
    }
}

async function renderQuickSetupServer(backFn:() => api.ODPromiseVoid){
    const {client} = quickSetupStorage
    if (!client) return

    renderHeader("⏱️ Open Ticket Quick Setup: Discord Server")

    terminal.bold.blue("(Step 3) Please select a Discord Server to use.\n")
    terminal.gray("The bot will only work in this server.\n\n")

    const guilds = await client.getGuilds()
    const nameList = guilds.map((g) => g.name)
    const longestName = utilities.getLongestLength(nameList)
    const guildList = guilds.map((g) => g.name.padEnd(longestName+5," ")+ansis.gray(" ("+g.id+")"))

    const answer = await terminal.singleColumnMenu([ansis.green("🔄 <Refresh List>"),...guildList],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (answer.canceled) return backFn()
    if (answer.selectedIndex == 0) return await renderQuickSetupServer(backFn)
    const server = guilds[answer.selectedIndex-1]
    quickSetupStorage.guild = server
    await renderQuickSetupAdminRoles([],async () => {await renderQuickSetupServer(backFn)})
}

async function renderQuickSetupAdminRoles(selectedAdmins:string[],backFn:() => api.ODPromiseVoid,cachedRoles?:discord.Role[]){
    const {client,guild} = quickSetupStorage
    if (!client || !guild) return

    renderHeader("⏱️ Open Ticket Quick Setup: Admin Roles")

    terminal.bold.blue("(Step 4) Please select all 'Global Admins' roles to use.\n")
    terminal.gray("Users with one of these roles will be able to access & interact with all tickets.\n\n")

    const roles = cachedRoles ?? (await guild.roles.fetch()).toJSON().sort((a,b) => b.position-a.position)
    const nameList = roles.map((r) => r.name)
    const longestName = utilities.getLongestLength(nameList)
    const roleList = roles.map((r) => selectedAdmins.includes(r.id) ? ansis.green("(✅) "+r.name.padEnd(longestName+5," ")+ansis.gray(" ("+r.id+")")) : r.name.padEnd(longestName+5," ")+ansis.gray(" ("+r.id+")"))
    
    const answer = await terminal.singleColumnMenu([ansis.green("🔄 <Refresh List>"),ansis.green("🆗 <Continue>"),...roleList],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return backFn()
    if (answer.selectedIndex == 0) return await renderQuickSetupAdminRoles(selectedAdmins,backFn)
    if (answer.selectedIndex == 1){
        quickSetupStorage.globalAdmins = selectedAdmins
        return await renderQuickSetupColorPicker(backFn)
    }
    const adminRole = roles[answer.selectedIndex-2]
    const index = selectedAdmins.findIndex((r) => r == adminRole.id)
    if (index > -1) selectedAdmins.splice(index,1)
    else selectedAdmins.push(adminRole.id)
    return await renderQuickSetupAdminRoles(selectedAdmins,backFn,roles)
}

async function renderQuickSetupColorPicker(backFn:() => api.ODPromiseVoid,tryAgain?:boolean){
    const {client,guild,globalAdmins} = quickSetupStorage
    if (!client || !guild || !globalAdmins) return

    renderHeader("⏱️ Open Ticket Quick Setup: Main Color")

    terminal.bold.blue("(Step 5) Please insert a valid hex-color to use in all embeds.\n")
    terminal.gray("You can also choose from existing presets. (e.g. red, green, blue, ...)\n\n")
    terminal.gray(tryAgain ? ansis.bold.red("Invalid color, please try again!\n")+ansis.gray("> ") : "> ")

    const answer = await terminal.inputField({
        style:terminal.white,
        hintStyle:terminal.gray,
        cancelable:true,
        autoComplete:Array.from(presetColors.keys()),
        autoCompleteHint:true,
        autoCompleteMenu:autoCompleteMenuOpts as Terminal.Autocompletion
    }).promise

    if (typeof answer != "string") return await backFn()
    else{
        if (!Array.from(presetColors.keys()).includes(answer) && !/^#[0-9a-f]{6}$/.test(answer)) return await renderQuickSetupColorPicker(backFn,true)
        let color: discord.ColorResolvable
        if (Array.from(presetColors.keys()).includes(answer)){
            color = presetColors.get(answer) as number
        }else{
            color = answer as `#${string}`
        }
        quickSetupStorage.mainColor = color
        await renderQuickSetupLanguage(async () => {await renderQuickSetupColorPicker(backFn)})
    }
}

async function renderQuickSetupLanguage(backFn:() => api.ODPromiseVoid,tryAgain?:boolean){
    renderHeader("⏱️ Open Ticket Quick Setup: Language")
    
    terminal.bold.blue("(Step 6) What language would you like to use in the bot?\n")
    terminal.gray("View a list of available languages here: https://otgithub.dj-dj.be/tree/main/README.md#-translators\n\n")
    terminal.gray(tryAgain ? ansis.bold.red("Language not found, please try again!\n")+ansis.gray("> ") : "> ")

    const answer = await terminal.inputField({
        style:terminal.white,
        hintStyle:terminal.gray,
        cancelable:true,
        autoComplete:opendiscord.defaults.getDefault("languageList"),
        autoCompleteHint:true,
        autoCompleteMenu:autoCompleteMenuOpts as Terminal.Autocompletion
    }).promise

    if (typeof answer != "string") return await backFn()
    else{
        if (!opendiscord.defaults.getDefault("languageList").includes(answer.toLowerCase())) return await renderQuickSetupLanguage(backFn,true)
        quickSetupStorage.language = answer.toLowerCase()
        await renderQuickSetupCommandTypes(async () => {await renderQuickSetupLanguage(backFn)})
    }
}

async function renderQuickSetupCommandTypes(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Command Types")

    terminal.bold.blue("(Step 7) Would you like to use slash commands, text commands or both?\n")
    terminal.gray("Slash commands are recommended.\n\n")

    const answer = await terminal.singleColumnMenu([
        "Use Slash Commands",
        "Use Text Commands",
        "Use Both Slash & Text Commands",
    ],{
        leftPadding:"> ",
        style:terminal.gray,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (answer.canceled) return await backFn()
    else if (answer.selectedIndex == 0){
        quickSetupStorage.slashCommands = true
        quickSetupStorage.textCommands = false
    }else if (answer.selectedIndex == 1){
        quickSetupStorage.slashCommands = false
        quickSetupStorage.textCommands = true
    }else if (answer.selectedIndex == 2){
        quickSetupStorage.slashCommands = true
        quickSetupStorage.textCommands = true
    }
    await renderQuickSetupStatusType(async () => {await renderQuickSetupCommandTypes(backFn)})
}

async function renderQuickSetupStatusType(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Status Type")

    terminal.bold.blue("(Step 8) Please select the type of status you want to use.\n")
    terminal.gray("The status will be shown below the bot name in the userlist.\n\n")

    const answer = await terminal.singleColumnMenu([
        "Disabled",
        "Custom",
        "Listening To ...",
        "Watching ...",
        "Playing ..."
    ],{
        leftPadding:"> ",
        style:terminal.gray,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (answer.canceled) return await backFn()
    else if (answer.selectedIndex == 0) quickSetupStorage.status = {enabled:false,status:"online",type:"custom",text:""}
    else if (answer.selectedIndex == 1) quickSetupStorage.status = {enabled:true,status:"online",type:"custom",text:""}
    else if (answer.selectedIndex == 2) quickSetupStorage.status = {enabled:true,status:"online",type:"listening",text:""}
    else if (answer.selectedIndex == 3) quickSetupStorage.status = {enabled:true,status:"online",type:"watching",text:""}
    else if (answer.selectedIndex == 4) quickSetupStorage.status = {enabled:true,status:"online",type:"playing",text:""}
    
    if (answer.selectedIndex == 0) await renderQuickSetupLOREMIPSUM9(async () => {await renderQuickSetupStatusType(backFn)})
    else await renderQuickSetupStatusText(async () => {await renderQuickSetupStatusType(backFn)})
}

async function renderQuickSetupStatusText(backFn:() => api.ODPromiseVoid){
    const {status} = quickSetupStorage
    if (!status) return

    renderHeader("⏱️ Open Ticket Quick Setup: Status Text")

    terminal.bold.blue("(Step 8.1) What text would you like to display in the status?\n")
    terminal.gray("This will be appended after the type you have chosen in the previous question.\n\n> ")
    terminal.gray(status.type == "listening" ? "Listening To " : (status.type == "playing" ? "Playing " : (status.type == "watching" ? "Watching " : "")))

    const answer = await terminal.inputField({
        style:terminal.white,
        hintStyle:terminal.gray,
        cancelable:true
    }).promise

    if (typeof answer != "string") return await backFn()
    else{
        status.text = answer
        await renderQuickSetupLOREMIPSUM9(async () => {await renderQuickSetupStatusText(backFn)})
    }
}

async function renderQuickSetupLOREMIPSUM9(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: LOREMIPSUM")

    console.log("todo",quickSetupStorage)
}
