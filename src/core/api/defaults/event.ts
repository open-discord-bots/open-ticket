///////////////////////////////////////
//DEFAULT EVENT MODULE
///////////////////////////////////////
//BASE MODULES
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"

//DEFAULT MODULES
import { ODPluginClassManager_Default, ODPluginManager_Default } from "./plugin"
import { ODConfigManager_Default} from "./config"
import { ODDatabaseManager_Default } from "./database"
import { ODFlagManager_Default } from "./flag"
import { ODSessionManager_Default } from "./session"
import { ODLanguageManager_Default } from "./language"
import { ODCheckerFunctionManager_Default, ODCheckerManager_Default, ODCheckerRenderer_Default, ODCheckerTranslationRegister_Default } from "./checker"
import { ODClientManager_Default, ODContextMenuManager_Default, ODSlashCommandManager_Default, ODTextCommandManager_Default } from "./client"
import { ODBuilderManager_Default, ODButtonManager_Default, ODDropdownManager_Default, ODEmbedManager_Default, ODFileManager_Default, ODMessageManager_Default, ODModalManager_Default } from "./builder"
import { ODAutocompleteResponderManager_Default, ODButtonResponderManager_Default, ODCommandResponderManager_Default, ODContextMenuResponderManager_Default, ODDropdownResponderManager_Default, ODModalResponderManager_Default, ODResponderManager_Default } from "./responder"
import { ODActionManager_Default } from "./action"
import { ODPermissionManager_Default } from "./permission"
import { ODHelpMenuManager_Default } from "./helpmenu"
import { ODStatsManager_Default } from "./stat"
import { ODCodeManager_Default } from "./code"
import { ODCooldownManager_Default } from "./cooldown"
import { ODPostManager_Default } from "./post"
import { ODVerifyBarManager_Default } from "./verifybar"
import { ODStartScreenManager_Default } from "./startscreen"
import { ODLiveStatusManager_Default } from "./console"
import { ODProgressBarManager_Default, ODProgressBarRendererManager_Default } from "./progressbar"

//OPEN TICKET MODULES
import { ODOptionManager, ODTicketOption } from "../openticket/option"
import { ODPanel, ODPanelManager } from "../openticket/panel"
import { ODTicket, ODTicketClearFilter, ODTicketManager } from "../openticket/ticket"
import { ODQuestionManager } from "../openticket/question"
import { ODBlacklistManager } from "../openticket/blacklist"
import { ODTranscriptManager_Default } from "../openticket/transcript"
import { ODRole, ODRoleManager } from "../openticket/role"
import { ODPriorityLevel, ODPriorityManager_Default } from "../openticket/priority"

/**## ODEventIds_Default `interface`
 * This interface is a list of ids available in the `ODEvent_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODEventIds_Default {
    //error handling
    "onErrorHandling": ODEvent_Default<(error:Error, origin:NodeJS.UncaughtExceptionOrigin) => api.ODPromiseVoid>
    "afterErrorHandling": ODEvent_Default<(error:Error, origin:NodeJS.UncaughtExceptionOrigin, message:api.ODError) => api.ODPromiseVoid>

    //plugins
    "afterPluginsLoaded": ODEvent_Default<(plugins:ODPluginManager_Default) => api.ODPromiseVoid>
    "onPluginClassLoad": ODEvent_Default<(classes:ODPluginClassManager_Default, plugins:ODPluginManager_Default) => api.ODPromiseVoid>
    "afterPluginClassesLoaded": ODEvent_Default<(classes:ODPluginClassManager_Default, plugins:ODPluginManager_Default) => api.ODPromiseVoid>

    //flags
    "onFlagLoad": ODEvent_Default<(flags:ODFlagManager_Default) => api.ODPromiseVoid>
    "afterFlagsLoaded": ODEvent_Default<(flags:ODFlagManager_Default) => api.ODPromiseVoid>
    "onFlagInit": ODEvent_Default<(flags:ODFlagManager_Default) => api.ODPromiseVoid>
    "afterFlagsInitiated": ODEvent_Default<(flags:ODFlagManager_Default) => api.ODPromiseVoid>

    //progress bars
    "onProgressBarRendererLoad": ODEvent_Default<(renderers:ODProgressBarRendererManager_Default) => api.ODPromiseVoid>
    "afterProgressBarRenderersLoaded": ODEvent_Default<(renderers:ODProgressBarRendererManager_Default) => api.ODPromiseVoid>
    "onProgressBarLoad": ODEvent_Default<(progressbars:ODProgressBarManager_Default) => api.ODPromiseVoid>
    "afterProgressBarsLoaded": ODEvent_Default<(progressbars:ODProgressBarManager_Default) => api.ODPromiseVoid>

    //configs
    "onConfigLoad": ODEvent_Default<(configs:ODConfigManager_Default) => api.ODPromiseVoid>
    "afterConfigsLoaded": ODEvent_Default<(configs:ODConfigManager_Default) => api.ODPromiseVoid>
    "onConfigInit": ODEvent_Default<(configs:ODConfigManager_Default) => api.ODPromiseVoid>
    "afterConfigsInitiated": ODEvent_Default<(configs:ODConfigManager_Default) => api.ODPromiseVoid>

    //databases
    "onDatabaseLoad": ODEvent_Default<(databases:ODDatabaseManager_Default) => api.ODPromiseVoid>
    "afterDatabasesLoaded": ODEvent_Default<(databases:ODDatabaseManager_Default) => api.ODPromiseVoid>
    "onDatabaseInit": ODEvent_Default<(databases:ODDatabaseManager_Default) => api.ODPromiseVoid>
    "afterDatabasesInitiated": ODEvent_Default<(databases:ODDatabaseManager_Default) => api.ODPromiseVoid>

    //languages
    "onLanguageLoad": ODEvent_Default<(languages:ODLanguageManager_Default) => api.ODPromiseVoid>
    "afterLanguagesLoaded": ODEvent_Default<(languages:ODLanguageManager_Default) => api.ODPromiseVoid>
    "onLanguageInit": ODEvent_Default<(languages:ODLanguageManager_Default) => api.ODPromiseVoid>
    "afterLanguagesInitiated": ODEvent_Default<(languages:ODLanguageManager_Default) => api.ODPromiseVoid>
    "onLanguageSelect": ODEvent_Default<(languages:ODLanguageManager_Default) => api.ODPromiseVoid>
    "afterLanguagesSelected": ODEvent_Default<(main:api.ODLanguage|null, backup:api.ODLanguage|null, languages:ODLanguageManager_Default) => api.ODPromiseVoid>

    //sessions
    "onSessionLoad": ODEvent_Default<(languages:ODSessionManager_Default) => api.ODPromiseVoid>
    "afterSessionsLoaded": ODEvent_Default<(languages:ODSessionManager_Default) => api.ODPromiseVoid>

    //config checkers
    "onCheckerLoad": ODEvent_Default<(checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "afterCheckersLoaded": ODEvent_Default<(checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "onCheckerFunctionLoad": ODEvent_Default<(functions:ODCheckerFunctionManager_Default, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "afterCheckerFunctionsLoaded": ODEvent_Default<(functions:ODCheckerFunctionManager_Default, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "onCheckerExecute": ODEvent_Default<(checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "afterCheckersExecuted": ODEvent_Default<(result:api.ODCheckerResult, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "onCheckerTranslationLoad": ODEvent_Default<(translations:ODCheckerTranslationRegister_Default, enabled:boolean, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "afterCheckerTranslationsLoaded": ODEvent_Default<(translations:ODCheckerTranslationRegister_Default, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "onCheckerRender": ODEvent_Default<(renderer:ODCheckerRenderer_Default, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "afterCheckersRendered": ODEvent_Default<(renderer:ODCheckerRenderer_Default, checkers:ODCheckerManager_Default) => api.ODPromiseVoid>
    "onCheckerQuit": ODEvent_Default<(checkers:ODCheckerManager_Default) => api.ODPromiseVoid>

    //plugin loading before client
    "onPluginBeforeClientLoad": ODEvent_Default<() => api.ODPromiseVoid>,
    "afterPluginBeforeClientLoaded": ODEvent_Default<() => api.ODPromiseVoid>,

    //client configuration
    "onClientLoad": ODEvent_Default<(client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterClientLoaded": ODEvent_Default<(client:ODClientManager_Default) => api.ODPromiseVoid>
    "onClientInit": ODEvent_Default<(client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterClientInitiated": ODEvent_Default<(client:ODClientManager_Default) => api.ODPromiseVoid>
    "onClientReady": ODEvent_Default<(client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterClientReady": ODEvent_Default<(client:ODClientManager_Default) => api.ODPromiseVoid>
    "onClientActivityLoad": ODEvent_Default<(activity:api.ODClientActivityManager, client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterClientActivityLoaded": ODEvent_Default<(activity:api.ODClientActivityManager, client:ODClientManager_Default) => api.ODPromiseVoid>
    "onClientActivityInit": ODEvent_Default<(activity:api.ODClientActivityManager, client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterClientActivityInitiated": ODEvent_Default<(activity:api.ODClientActivityManager, client:ODClientManager_Default) => api.ODPromiseVoid>
    
    //priority levels
    "onPriorityLoad": ODEvent_Default<(priorities:ODPriorityManager_Default) => api.ODPromiseVoid>
    "afterPrioritiesLoaded": ODEvent_Default<(priorities:ODPriorityManager_Default) => api.ODPromiseVoid>

    //client slash commands
    "onSlashCommandLoad": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterSlashCommandsLoaded": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>
    "onSlashCommandRegister": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterSlashCommandsRegistered": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>

    //client context menus
    "onContextMenuLoad": ODEvent_Default<(menu:ODContextMenuManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterContextMenusLoaded": ODEvent_Default<(menu:ODContextMenuManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>
    "onContextMenuRegister": ODEvent_Default<(menu:ODContextMenuManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>
    "afterContextMenusRegistered": ODEvent_Default<(menu:ODContextMenuManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>

    //client text commands
    "onTextCommandLoad": ODEvent_Default<(text:ODTextCommandManager_Default, client:ODClientManager_Default,) => api.ODPromiseVoid>
    "afterTextCommandsLoaded": ODEvent_Default<(text:ODTextCommandManager_Default, client:ODClientManager_Default) => api.ODPromiseVoid>

    //plugin loading before managers
    "onPluginBeforeManagerLoad": ODEvent_Default<() => api.ODPromiseVoid>,
    "afterPluginBeforeManagerLoaded": ODEvent_Default<() => api.ODPromiseVoid>,

    //questions
    "onQuestionLoad": ODEvent_Default<(questions:ODQuestionManager) => api.ODPromiseVoid>
    "afterQuestionsLoaded": ODEvent_Default<(questions:ODQuestionManager) => api.ODPromiseVoid>

    //options
    "onOptionLoad": ODEvent_Default<(options:ODOptionManager) => api.ODPromiseVoid>
    "afterOptionsLoaded": ODEvent_Default<(options:ODOptionManager) => api.ODPromiseVoid>

    //panels
    "onPanelLoad": ODEvent_Default<(panels:ODPanelManager) => api.ODPromiseVoid>
    "afterPanelsLoaded": ODEvent_Default<(panels:ODPanelManager) => api.ODPromiseVoid>
    "onPanelSpawn": ODEvent_Default<(panel:ODPanel) => api.ODPromiseVoid>
    "afterPanelSpawned": ODEvent_Default<(panel:ODPanel) => api.ODPromiseVoid>

    //tickets
    "onTicketLoad": ODEvent_Default<(tickets:ODTicketManager) => api.ODPromiseVoid>
    "afterTicketsLoaded": ODEvent_Default<(tickets:ODTicketManager) => api.ODPromiseVoid>

    //ticket creation
    "onTicketChannelCreation": ODEvent_Default<(option:ODTicketOption, user:discord.User) => api.ODPromiseVoid>
    "afterTicketChannelCreated": ODEvent_Default<(option:ODTicketOption, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "onTicketChannelDeletion": ODEvent_Default<(ticket:ODTicket, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTicketChannelDeleted": ODEvent_Default<(ticket:ODTicket, user:discord.User) => api.ODPromiseVoid>
    "onTicketPermissionsCreated": ODEvent_Default<(option:ODTicketOption, permissions:ODPermissionManager_Default, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTicketPermissionsCreated": ODEvent_Default<(option:ODTicketOption, permissions:ODPermissionManager_Default, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "onTicketMainMessageCreated": ODEvent_Default<(ticket:ODTicket, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTicketMainMessageCreated": ODEvent_Default<(ticket:ODTicket, message:discord.Message, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>

    //ticket actions
    "onTicketCreate": ODEvent_Default<(creator:discord.User) => api.ODPromiseVoid>
    "afterTicketCreated": ODEvent_Default<(ticket:ODTicket, creator:discord.User, channel:discord.GuildTextBasedChannel) => api.ODPromiseVoid>
    "onTicketClose": ODEvent_Default<(ticket:ODTicket, closer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketClosed": ODEvent_Default<(ticket:ODTicket, closer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketReopen": ODEvent_Default<(ticket:ODTicket, reopener:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketReopened": ODEvent_Default<(ticket:ODTicket, reopener:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketDelete": ODEvent_Default<(ticket:ODTicket, deleter:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketDeleted": ODEvent_Default<(ticket:ODTicket, deleter:discord.User, reason:string|null) => api.ODPromiseVoid>
    "onTicketMove": ODEvent_Default<(ticket:ODTicket, mover:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketMoved": ODEvent_Default<(ticket:ODTicket, mover:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketClaim": ODEvent_Default<(ticket:ODTicket, claimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketClaimed": ODEvent_Default<(ticket:ODTicket, claimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUnclaim": ODEvent_Default<(ticket:ODTicket, unclaimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUnclaimed": ODEvent_Default<(ticket:ODTicket, unclaimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketPin": ODEvent_Default<(ticket:ODTicket, pinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketPinned": ODEvent_Default<(ticket:ODTicket, pinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUnpin": ODEvent_Default<(ticket:ODTicket, unpinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUnpinned": ODEvent_Default<(ticket:ODTicket, unpinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUserAdd": ODEvent_Default<(ticket:ODTicket, adder:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUserAdded": ODEvent_Default<(ticket:ODTicket, adder:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUserRemove": ODEvent_Default<(ticket:ODTicket, remover:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUserRemoved": ODEvent_Default<(ticket:ODTicket, remover:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketRename": ODEvent_Default<(ticket:ODTicket, renamer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketRenamed": ODEvent_Default<(ticket:ODTicket, renamer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketsClear": ODEvent_Default<(tickets:ODTicket[], clearer:discord.User, channel:discord.GuildTextBasedChannel, filter:ODTicketClearFilter) => api.ODPromiseVoid>
    "afterTicketsCleared": ODEvent_Default<(tickets:ODTicket[], clearer:discord.User, channel:discord.GuildTextBasedChannel, filter:ODTicketClearFilter) => api.ODPromiseVoid>
    "onTicketTopicChange": ODEvent_Default<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldTopic:string, newTopic:string) => api.ODPromiseVoid>
    "afterTicketTopicChanged": ODEvent_Default<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldTopic:string, newTopic:string) => api.ODPromiseVoid>
    "onTicketPriorityChange": ODEvent_Default<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldPriority:ODPriorityLevel, newPriority:ODPriorityLevel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketPriorityChanged": ODEvent_Default<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldPriority:ODPriorityLevel, newPriority:ODPriorityLevel, reason:string|null) => api.ODPromiseVoid>
    "onTicketTransfer": ODEvent_Default<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldCreator:discord.User, newCreator:discord.User, reason:string|null) => api.ODPromiseVoid>
    "afterTicketTransferred": ODEvent_Default<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldCreator:discord.User, newCreator:discord.User, reason:string|null) => api.ODPromiseVoid>
    
    //roles
    "onRoleLoad": ODEvent_Default<(roles:ODRoleManager) => api.ODPromiseVoid>
    "afterRolesLoaded": ODEvent_Default<(roles:ODRoleManager) => api.ODPromiseVoid>
    "onRoleUpdate": ODEvent_Default<(user:discord.User,role:ODRole) => api.ODPromiseVoid>
    "afterRolesUpdated": ODEvent_Default<(user:discord.User,role:ODRole) => api.ODPromiseVoid>

    //blacklist
    "onBlacklistLoad": ODEvent_Default<(blacklist:ODBlacklistManager) => api.ODPromiseVoid>
    "afterBlacklistLoaded": ODEvent_Default<(blacklist:ODBlacklistManager) => api.ODPromiseVoid>

    //transcripts
    "onTranscriptCompilerLoad": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => api.ODPromiseVoid>
    "afterTranscriptCompilersLoaded": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => api.ODPromiseVoid>
    "onTranscriptHistoryLoad": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => api.ODPromiseVoid>
    "afterTranscriptHistoryLoaded": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => api.ODPromiseVoid>

    //transcript creation
    "onTranscriptCreate": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptCreated": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "onTranscriptInit": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptInitiated": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "onTranscriptCompile": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptCompiled": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "onTranscriptReady": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptReady": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => api.ODPromiseVoid>

    //plugin loading before builders
    "onPluginBeforeBuilderLoad": ODEvent_Default<() => api.ODPromiseVoid>,
    "afterPluginBeforeBuilderLoaded": ODEvent_Default<() => api.ODPromiseVoid>,

    //builders
    "onButtonBuilderLoad": ODEvent_Default<(buttons:ODButtonManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterButtonBuildersLoaded": ODEvent_Default<(buttons:ODButtonManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onDropdownBuilderLoad": ODEvent_Default<(dropdowns:ODDropdownManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterDropdownBuildersLoaded": ODEvent_Default<(dropdowns:ODDropdownManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onFileBuilderLoad": ODEvent_Default<(files:ODFileManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterFileBuildersLoaded": ODEvent_Default<(files:ODFileManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onEmbedBuilderLoad": ODEvent_Default<(embeds:ODEmbedManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterEmbedBuildersLoaded": ODEvent_Default<(embeds:ODEmbedManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onMessageBuilderLoad": ODEvent_Default<(messages:ODMessageManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterMessageBuildersLoaded": ODEvent_Default<(messages:ODMessageManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onModalBuilderLoad": ODEvent_Default<(modals:ODModalManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterModalBuildersLoaded": ODEvent_Default<(modals:ODModalManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>

    //plugin loading before responders
    "onPluginBeforeResponderLoad": ODEvent_Default<() => api.ODPromiseVoid>,
    "afterPluginBeforeResponderLoaded": ODEvent_Default<() => api.ODPromiseVoid>,

    //responders
    "onCommandResponderLoad": ODEvent_Default<(commands:ODCommandResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterCommandRespondersLoaded": ODEvent_Default<(commands:ODCommandResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onButtonResponderLoad": ODEvent_Default<(buttons:ODButtonResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterButtonRespondersLoaded": ODEvent_Default<(buttons:ODButtonResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onDropdownResponderLoad": ODEvent_Default<(dropdowns:ODDropdownResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterDropdownRespondersLoaded": ODEvent_Default<(dropdowns:ODDropdownResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onModalResponderLoad": ODEvent_Default<(modals:ODModalResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterModalRespondersLoaded": ODEvent_Default<(modals:ODModalResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onContextMenuResponderLoad": ODEvent_Default<(menus:ODContextMenuResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterContextMenuRespondersLoaded": ODEvent_Default<(menus:ODContextMenuResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "onAutocompleteResponderLoad": ODEvent_Default<(autocomplete:ODAutocompleteResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterAutocompleteRespondersLoaded": ODEvent_Default<(autocomplete:ODAutocompleteResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => api.ODPromiseVoid>

    //plugin loading before finalizations
    "onPluginBeforeFinalizationLoad": ODEvent_Default<() => api.ODPromiseVoid>,
    "afterPluginBeforeFinalizationLoaded": ODEvent_Default<() => api.ODPromiseVoid>,

    //actions
    "onActionLoad": ODEvent_Default<(actions:ODActionManager_Default) => api.ODPromiseVoid>
    "afterActionsLoaded": ODEvent_Default<(actions:ODActionManager_Default) => api.ODPromiseVoid>

    //verifybars
    "onVerifyBarLoad": ODEvent_Default<(verifybars:ODVerifyBarManager_Default) => api.ODPromiseVoid>
    "afterVerifyBarsLoaded": ODEvent_Default<(verifybars:ODVerifyBarManager_Default) => api.ODPromiseVoid>

    //permissions
    "onPermissionLoad": ODEvent_Default<(permissions:ODPermissionManager_Default) => api.ODPromiseVoid>
    "afterPermissionsLoaded": ODEvent_Default<(permissions:ODPermissionManager_Default) => api.ODPromiseVoid>

    //posts
    "onPostLoad": ODEvent_Default<(posts:ODPostManager_Default) => api.ODPromiseVoid>
    "afterPostsLoaded": ODEvent_Default<(posts:ODPostManager_Default) => api.ODPromiseVoid>
    "onPostInit": ODEvent_Default<(posts:ODPostManager_Default) => api.ODPromiseVoid>
    "afterPostsInitiated": ODEvent_Default<(posts:ODPostManager_Default) => api.ODPromiseVoid>

    //cooldowns
    "onCooldownLoad": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => api.ODPromiseVoid>
    "afterCooldownsLoaded": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => api.ODPromiseVoid>
    "onCooldownInit": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => api.ODPromiseVoid>
    "afterCooldownsInitiated": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => api.ODPromiseVoid>

    //help menu
    "onHelpMenuCategoryLoad": ODEvent_Default<(menu:ODHelpMenuManager_Default) => api.ODPromiseVoid>
    "afterHelpMenuCategoriesLoaded": ODEvent_Default<(menu:ODHelpMenuManager_Default) => api.ODPromiseVoid>
    "onHelpMenuComponentLoad": ODEvent_Default<(menu:ODHelpMenuManager_Default) => api.ODPromiseVoid>
    "afterHelpMenuComponentsLoaded": ODEvent_Default<(menu:ODHelpMenuManager_Default) => api.ODPromiseVoid>

    //stats
    "onStatScopeLoad": ODEvent_Default<(stats:ODStatsManager_Default) => api.ODPromiseVoid>
    "afterStatScopesLoaded": ODEvent_Default<(stats:ODStatsManager_Default) => api.ODPromiseVoid>
    "onStatLoad": ODEvent_Default<(stats:ODStatsManager_Default) => api.ODPromiseVoid>
    "afterStatsLoaded": ODEvent_Default<(stats:ODStatsManager_Default) => api.ODPromiseVoid>
    "onStatInit": ODEvent_Default<(stats:ODStatsManager_Default) => api.ODPromiseVoid>
    "afterStatsInitiated": ODEvent_Default<(stats:ODStatsManager_Default) => api.ODPromiseVoid>

    //plugin loading before code
    "onPluginBeforeCodeLoad": ODEvent_Default<() => api.ODPromiseVoid>,
    "afterPluginBeforeCodeLoaded": ODEvent_Default<() => api.ODPromiseVoid>,

    //code
    "onCodeLoad": ODEvent_Default<(code:ODCodeManager_Default) => api.ODPromiseVoid>
    "afterCodeLoaded": ODEvent_Default<(code:ODCodeManager_Default) => api.ODPromiseVoid>
    "onCodeExecute": ODEvent_Default<(code:ODCodeManager_Default) => api.ODPromiseVoid>
    "afterCodeExecuted": ODEvent_Default<(code:ODCodeManager_Default) => api.ODPromiseVoid>

    //livestatus
    "onLiveStatusSourceLoad": ODEvent_Default<(livestatus:ODLiveStatusManager_Default) => api.ODPromiseVoid>
    "afterLiveStatusSourcesLoaded": ODEvent_Default<(livestatus:ODLiveStatusManager_Default) => api.ODPromiseVoid>

    //startscreen
    "onStartScreenLoad": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => api.ODPromiseVoid>
    "afterStartScreensLoaded": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => api.ODPromiseVoid>
    "onStartScreenRender": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => api.ODPromiseVoid>
    "afterStartScreensRendered": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => api.ODPromiseVoid>

    //ready
    "beforeReadyForUsage": ODEvent_Default<() => api.ODPromiseVoid>
    "onReadyForUsage": ODEvent_Default<() => api.ODPromiseVoid>
}

/**## ODEventManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEvent class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.events`!
 */
export class ODEventManager_Default extends api.ODEventManager {
    get<StartScreenId extends keyof ODEventIds_Default>(id:StartScreenId): ODEventIds_Default[StartScreenId]
    get(id:api.ODValidId): api.ODEvent|null
    
    get(id:api.ODValidId): api.ODEvent|null {
        return super.get(id)
    }

    remove<StartScreenId extends keyof ODEventIds_Default>(id:StartScreenId): ODEventIds_Default[StartScreenId]
    remove(id:api.ODValidId): api.ODEvent|null
    
    remove(id:api.ODValidId): api.ODEvent|null {
        return super.remove(id)
    }

    exists(id:keyof ODEventIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODEventManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEvent class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.events`!
 */
export class ODEvent_Default<Callback extends ((...args:any) => api.ODPromiseVoid)> extends api.ODEvent {
    listen(callback:Callback): void {
        return super.listen(callback)
    }
    listenOnce(callback:Callback): void {
        return super.listenOnce(callback)
    }
    wait(): Promise<Parameters<Callback>>
    wait(): Promise<any[]> {
        return super.wait()
    }
    emit(params:Parameters<Callback>): Promise<void> {
        return super.emit(params)
    }
}