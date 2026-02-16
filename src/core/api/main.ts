///////////////////////////////////////
//OPEN TICKET MAIN MODULE
///////////////////////////////////////
import * as api from "./api"
import * as utilities from "@open-discord-bots/framework/utilities"

export class ODOpenTicketMain extends api.ODMain {
    declare versions: api.ODVersionManager_Default
    declare events: api.ODEventManager_Default

    declare plugins: api.ODPluginManager_Default
    declare flags: api.ODFlagManager_Default
    declare progressbars: api.ODProgressBarManager_Default
    declare configs: api.ODConfigManager_Default
    declare databases: api.ODDatabaseManager_Default
    declare sessions: api.ODSessionManager_Default
    declare languages: api.ODLanguageManager_Default
    
    declare checkers: api.ODCheckerManager_Default
    declare builders: api.ODBuilderManager_Default
    declare responders: api.ODResponderManager_Default
    declare actions: api.ODActionManager_Default
    declare verifybars: api.ODVerifyBarManager_Default
    declare permissions: api.ODPermissionManager_Default
    declare cooldowns: api.ODCooldownManager_Default
    declare helpmenu: api.ODHelpMenuManager_Default
    declare stats: api.ODStatsManager_Default
    declare code: api.ODCodeManager_Default
    declare posts: api.ODPostManager_Default
    
    declare client: api.ODClientManager_Default
    declare livestatus: api.ODLiveStatusManager_Default
    declare startscreen: api.ODStartScreenManager_Default

    /////////////////////
    //// OPEN TICKET ////
    /////////////////////

    /**Open Ticket specific fuses. With these fuses/switches, you can turn off "default behaviours" from the bot. Useful for replacing default behaviour with a custom implementation.  */
    fuses: api.ODFuseManager<api.ODOpenTicketFuseList>
    /**The manager that manages all the data of questions in the bot. (these are used in options & tickets) */
    questions: api.ODQuestionManager
    /**The manager that manages all the data of options in the bot. (these are used for panels, ticket creation, reaction roles) */
    options: api.ODOptionManager
    /**The manager that manages all the data of panels in the bot. (panels contain the options) */
    panels: api.ODPanelManager
    /**The manager that manages all tickets in the bot. (here, you can get & edit a lot of data from tickets) */
    tickets: api.ODTicketManager
    /**The manager that manages the ticket blacklist. (people who are blacklisted can't create a ticket) */
    blacklist: api.ODBlacklistManager
    /**The manager that manages the ticket transcripts. (both the history & compilers) */
    transcripts: api.ODTranscriptManager_Default
    /**The manager that manages all reaction roles in the bot. (here, you can add additional data to roles) */
    roles: api.ODRoleManager
    /**The manager that manages all priority levels in the bot. (register/edit ticket priority levels) */
    priorities: api.ODPriorityManager_Default

    constructor(){
        const version = api.ODVersion.fromString("opendiscord:version","v4.1.3")
        const debugfile = new api.ODDebugFileManager("./","otdebug.txt",5000,version)
        const console = new api.ODConsoleManager(100,debugfile)
        const debug = new api.ODDebugger(console)
        const client = new api.ODClientManager_Default(debug)
        const livestatus = new api.ODLiveStatusManager_Default(debug,console)
        const permissions = new api.ODPermissionManager_Default(debug,client)

        super({
            versions:new api.ODVersionManager_Default(),
            debugfile,console,debug,
            events:new api.ODEventManager_Default(debug),
            processStartupDate:new Date(),
            readyStartupDate:null,
        
            plugins:new api.ODPluginManager_Default(debug),
            flags:new api.ODFlagManager_Default(debug),
            progressbars:new api.ODProgressBarManager_Default(debug),
            configs:new api.ODConfigManager_Default(debug),
            databases:new api.ODDatabaseManager_Default(debug),
            sessions:new api.ODSessionManager_Default(debug),
            languages:new api.ODLanguageManager_Default(debug,false),
            
            checkers:new api.ODCheckerManager_Default(debug,new api.ODCheckerStorage(),new api.ODCheckerRenderer_Default(),new api.ODCheckerTranslationRegister_Default(),new api.ODCheckerFunctionManager_Default(debug)),
            builders:new api.ODBuilderManager_Default(debug),
            client,
            responders:new api.ODResponderManager_Default(debug,client),
            actions:new api.ODActionManager_Default(debug),
            verifybars:new api.ODVerifyBarManager_Default(debug),
            permissions,
            cooldowns:new api.ODCooldownManager_Default(debug),
            helpmenu:new api.ODHelpMenuManager_Default(debug),
            stats:new api.ODStatsManager_Default(debug),
            code:new api.ODCodeManager_Default(debug),
            posts:new api.ODPostManager_Default(debug),
            
            sharedFuses:utilities.sharedFuses,
            env:new api.ODEnvHelper(),
            livestatus,
            startscreen:new api.ODStartScreenManager_Default(debug,livestatus),
        },"openticket")

        this.livestatus.useMain(this)
        this.versions.add(api.ODVersion.fromString("opendiscord:version","v4.1.3"))
        this.versions.add(api.ODVersion.fromString("opendiscord:transcripts","v2.1.0"))

        //OPEN TICKET
        this.fuses = new api.ODFuseManager<api.ODOpenTicketFuseList>({
            questionLoading:true,
            optionLoading:true,
            panelLoading:true,
            ticketLoading:true,
            roleLoading:true,
            blacklistLoading:true,
            transcriptCompilerLoading:true,
            transcriptHistoryLoading:true,
            autocloseCheckInterval:300000, //5 minutes
            autodeleteCheckInterval:300000 //5 minutes
        })
        this.questions = new api.ODQuestionManager(debug)
        this.options = new api.ODOptionManager(debug)
        this.panels = new api.ODPanelManager(debug)
        this.tickets = new api.ODTicketManager(debug,client)
        this.blacklist = new api.ODBlacklistManager(debug)
        this.transcripts = new api.ODTranscriptManager_Default(debug,this.tickets,client,permissions)
        this.roles = new api.ODRoleManager(debug)
        this.priorities = new api.ODPriorityManager_Default(debug)
    }
}