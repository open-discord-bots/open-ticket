import {opendiscord, api, utilities} from "../../index.js"
import ansis from "ansis"

export async function loadAllStartScreenComponents(){
    //LOGO
    opendiscord.startscreen.add(new api.ODStartScreenLogoComponent("opendiscord:logo",1000,[
        "   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  ",
        "  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  ",
        "  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     ",
        "  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     ",
        "  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     ",
        "   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     "
    ],true,false))

    //HEADER
    const currentLanguageMetadata = opendiscord.languages.getLanguageMetadata()
    opendiscord.startscreen.add(new api.ODStartScreenHeaderComponent("opendiscord:header",999,[
        {key:"Version",value:opendiscord.versions.get("opendiscord:version").toString()},
        {key:"Support",value:"https://discord.dj-dj.be"},
        {key:"Language",value:(currentLanguageMetadata ? currentLanguageMetadata.language : "Unknown")}
    ],"  -  ",{
        align:"center",
        width:opendiscord.startscreen.get("opendiscord:logo")
    }))

    //FLAGS
    opendiscord.startscreen.add(new api.ODStartScreenFlagsCategoryComponent("opendiscord:flags",4,opendiscord.flags.getAll()))

    //PLUGINS
    opendiscord.startscreen.add(new api.ODStartScreenPluginsCategoryComponent("opendiscord:plugins",3,opendiscord.plugins.getAll(),opendiscord.plugins.unknownCrashedPlugins))
    
    //STATS
    opendiscord.startscreen.add(new api.ODStartScreenPropertiesCategoryComponent("opendiscord:stats",2,"startup info",[
        {key:"status",value:ansis.bold(opendiscord.client.activity.getStatusType())+opendiscord.client.activity.text+" ("+opendiscord.client.activity.mode+")"},
        {key:"options",value:"loaded "+ansis.bold(opendiscord.options.getLength().toString())+" options!"},
        {key:"panels",value:"loaded "+ansis.bold(opendiscord.panels.getLength().toString())+" panels!"},
        {key:"tickets",value:"loaded "+ansis.bold(opendiscord.tickets.getLength().toString())+" tickets!"},
        {key:"roles",value:"loaded "+ansis.bold(opendiscord.roles.getLength().toString())+" roles!"},
        {key:"help",value:ansis.bold(opendiscord.configs.get("opendiscord:general").data.prefix+"help")+" or "+ansis.bold("/help")}
    ]))

    //LIVESTATUS
    opendiscord.startscreen.add(new api.ODStartScreenLiveStatusCategoryComponent("opendiscord:livestatus",1,opendiscord.livestatus))

    //LOGS
    opendiscord.startscreen.add(new api.ODStartScreenLogCategoryComponent("opendiscord:logs",0))
}