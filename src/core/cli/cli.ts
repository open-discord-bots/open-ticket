import {opendiscord, api, utilities} from "../../index"
import {Terminal, terminal} from "terminal-kit"
import ansis from "ansis"

const logo = [
    "   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  ",
    "  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  ",
    "  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     ",
    "  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     ",
    "  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     ",
    "   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     "
]

/**A utility function to center text to a certain width. */
export function centerText(text:string,width:number){
    if (width < text.length) return text
    let newWidth = width-ansis.strip(text).length+1
    let final = " ".repeat(newWidth/2)+text
    return final
}

/**A utility function to terminate the interactive CLI. */
export async function terminate(){
    terminal.grabInput(false)
    terminal.clear()
    terminal.green("👋 Exited the Open Ticket Interactive Setup CLI.\n")
    process.exit(0)
}
terminal.on("key",(name,matches,data) => {
    if (name == "CTRL_C") terminate()
})

/**Render the header of the interactive CLI. */
export function renderHeader(path:(string|number)[]|string){
    terminal.grabInput(true)
    terminal.clear().moveTo(1,1)
    terminal(ansis.hex("#f8ba00")(logo.join("\n")+"\n"))
    terminal.bold(centerText("Interactive Setup CLI  -  Version: "+opendiscord.versions.get("opendiscord:version").toString()+"  -  Support: https://discord.dj-dj.be\n",88))
    if (typeof path == "string") terminal.cyan(centerText(path+"\n\n",88))
    else if (path.length < 1) terminal.cyan(centerText("👋 Hi! Welcome to the Open Ticket Interactive Setup CLI! 👋\n\n",88))
    else terminal.cyan(centerText("🌐 Current Location: "+path.map((v,i) => {
        if (i == 0) return v.toString()
        else if (typeof v == "string") return ".\""+v+"\""
        else if (typeof v == "number") return "."+v
    }).join("")+"\n\n",88))
}

async function renderCliModeSelector(backFn:(() => api.ODPromiseVoid)){
    renderHeader([])
    terminal(ansis.bold.green("Please select what CLI module you want to use.\n")+ansis.italic.gray("(use arrow keys to navigate, exit using escape)\n"))

    const answer = await terminal.singleColumnMenu([
        "✏️ Edit Config     "+ansis.gray("=> Edit the current config, add/remove new tickets/questions/panels & more!"),
        "⏱️ Quick Setup     "+ansis.gray("=> A quick and easy way of setting up the bot in your Discord server."),
    ],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    else if (answer.selectedIndex == 0) await (await import("./editConfig.js")).renderEditConfig(async () => {await renderCliModeSelector(backFn)})
    else if (answer.selectedIndex == 1) await (await import("./quickSetup.js")).renderQuickSetup(async () => {await renderCliModeSelector(backFn)})
}

export async function execute(){
    if (terminal.width < 100 || terminal.height < 35){
        terminal(ansis.red.bold("\n\nMake sure your console or cmd window has a "+ansis.cyan("minimum width & height")+" of "+ansis.cyan("100x35")+" characters."))
        terminal(ansis.red.bold("\nOtherwise the Open Ticket Interactive Setup CLI will be rendered incorrectly."))
        terminal(ansis.red.bold("\nThe current terminal dimensions are: "+ansis.cyan(terminal.width+"x"+terminal.height)+"."))
    }else await renderCliModeSelector(terminate)
}