import {opendiscord, api, utilities} from "../../index"
import {Terminal, terminal} from "terminal-kit"
import ansis from "ansis"
import * as discord from "discord.js"
import {renderHeader} from "./cli"

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
            await renderQuickSetupServer(result,async () => {await renderQuickSetupBotToken(backFn)})
        }
    }
}

async function renderQuickSetupServer(client:api.ODClientManager,backFn:() => api.ODPromiseVoid){
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
    if (answer.selectedIndex == 0) return await renderQuickSetupServer(client,backFn)
    const server = guilds[answer.selectedIndex-1]
    await renderQuickSetupAdminRoles(client,server,[],async () => {await renderQuickSetupServer(client,backFn)})
}

async function renderQuickSetupAdminRoles(client:api.ODClientManager,guild:discord.Guild,selectedAdmins:string[],backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Admin Roles")

    terminal.bold.blue("(Step 4) Please select all 'Global Admins' roles to use.\n")
    terminal.gray("Users with one of these roles will be able to access & interact with all tickets.\n\n")

}
