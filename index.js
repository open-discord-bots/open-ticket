/////////////// STARTUP FLAGS ///////////////
const flags = [
    // Edit flags here when being unable to use the flags in the command prompt.
    //PTERODACTYL PANEL
    //add startup flags here (e.g. "--no-compile") when running via the panel
]
/////////////// STARTUP FLAGS ///////////////

/*
 ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  
██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  
██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     
██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     
╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     
 v4.1.3 - Made by DJj123dj & Contributors

 Discord: https://discord.dj-dj.be
 Docs: https://otdocs.dj-dj.be
 Support Us: https://github.com/sponsors/DJj123dj/
 
 */

///////////////////////////////////////////
////////// COMPILATION + STARTUP //////////
///////////////////////////////////////////

const framework = require("@open-discord-bots/framework")
framework.frameworkStartup(flags,"openticket",() => {
    require("./dist/src/index.js")
})