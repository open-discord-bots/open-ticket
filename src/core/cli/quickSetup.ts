import {opendiscord, api, utilities} from "../../index"
import {Terminal, terminal} from "terminal-kit"
import ansis from "ansis"
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
    else if (answer.selectedIndex == 0) await renderQuickSetupDevPortalInfo(async () => {await renderQuickSetupWelcome(backFn)})
}

async function renderQuickSetupDevPortalInfo(backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Dev Portal & Experience")

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
    else if (answer.selectedIndex == 0) await backFn() //TODO NEXT QUESTION
    else if (answer.selectedIndex == 1) await renderQuickSetupDevPortalGuide(0,async () => {await renderQuickSetupDevPortalInfo(backFn)})
    else if (answer.selectedIndex == 2) await renderQuickSetupDevPortalGuide(1,async () => {await renderQuickSetupDevPortalInfo(backFn)})
}

async function renderQuickSetupDevPortalGuide(variation:0|1,backFn:() => api.ODPromiseVoid){
    renderHeader("⏱️ Open Ticket Quick Setup: Dev Portal & Experience")

    if (variation == 0){
        terminal.bold.blue("(Step 1.1) You've mentioned that you don't know how to create a Discord bot.\n\n")
        terminal.gray("Please visit the following URL for a step-by-step guide on how to create a Discord bot.\nIf it still doesn't work, join our Discord server and we will help you further!\n"+ansis.magenta("=> https://otdocs.dj-dj.be/docs/guides/get-started#bot\n\n"))
    }else{
        terminal.bold.blue("(Step 1.2) You've mentioned that you've never seen Discord bot before.\n\n")
        terminal.gray("How did you even download Open Ticket 🤪? But still, we have a step-by-step guide on how to create a Discord bot.\nIf it still doesn't work, join our Discord server and we will help you further!\n"+ansis.magenta("=> https://otdocs.dj-dj.be/docs/guides/get-started#bot\n\n"))
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
