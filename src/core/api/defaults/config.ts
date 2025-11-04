///////////////////////////////////////
//DEFAULT CONFIG MODULE
///////////////////////////////////////
import { ODValidButtonColor, ODValidId } from "../modules/base"
import * as discord from "discord.js"
import { ODConfigManager, ODConfig, ODJsonConfig } from "../modules/config"
import { ODClientActivityMode, ODClientActivityType } from "../modules/client"
import { ODRoleUpdateMode } from "../openticket/role"

/** (CONTRIBUTOR GUIDE) HOW TO ADD NEW CONFIG VARIABLES?
 * - Make the change to the config file in (./config/) and be aware of the following things:
 *      - The variable has a clear name and its function is obvious.
 *      - The variable is in the correct position/category of the config.
 *      - The variable contains a default placeholder to suggest the contents.
 *      - If there's a (./devconfig/), also modify this file. 
 * - Register the config in loadAllConfigs() in (./src/data/framework/configLoader.ts)
 *      - The variable should be added to the "formatters" in the correct position.
 * - Add autocomplete for the variable in ODJsonConfig_Default... in (./src/core/api/defaults/config.ts)
 * - Add the variable to the config checker in (./src/data/framework/checkerLoader.ts)
 *      - Make sure the variable is compatible with the Interactive Setup CLI.
 * - The variable should be added by the migration manager (./src/core/startup/migration.ts) when missing.
 * - Update the Open Ticket Documentation.
 * 
 * IF VARIABLE IS FROM questions.json, options.json OR panels.json:
 * - Check (./src/data/openticket/...) for loading/unloading of data.
 * - Check (./src/actions/createTicket.ts) and related files.
 * - Check (./src/builders), (./src/actions), (./src/data) & (./src/commands) in general in the areas that were changed.
 */

/**## ODConfigManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODConfigManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODConfigManagerIds_Default {
    "opendiscord:general":ODJsonConfig_DefaultGeneral,
    "opendiscord:questions":ODJsonConfig_DefaultQuestions,
    "opendiscord:options":ODJsonConfig_DefaultOptions,
    "opendiscord:panels":ODJsonConfig_DefaultPanels,
    "opendiscord:transcripts":ODJsonConfig_DefaultTranscripts
}

/**## ODConfigManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODConfigManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.configs`!
 */
export class ODConfigManager_Default extends ODConfigManager {
    get<ConfigId extends keyof ODConfigManagerIds_Default>(id:ConfigId): ODConfigManagerIds_Default[ConfigId]
    get(id:ODValidId): ODConfig|null
    
    get(id:ODValidId): ODConfig|null {
        return super.get(id)
    }
    
    remove<ConfigId extends keyof ODConfigManagerIds_Default>(id:ConfigId): ODConfigManagerIds_Default[ConfigId]
    remove(id:ODValidId): ODConfig|null
    
    remove(id:ODValidId): ODConfig|null {
        return super.remove(id)
    }

    exists(id:keyof ODConfigManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODJsonConfig_DefaultStatusType `interface`
 * This interface is an object which has all properties for the status object in the `general.json` config!
 */
export interface ODJsonConfig_DefaultStatusType {
    /**Is the status enabled? */
    enabled:boolean,
    /**The type of status (e.g. playing, listening, custom, ...) */
    type:Exclude<ODClientActivityType,false>,
    /**The mode/status of the bot (e.g. online, invisible, idle, do not disturb) */
    mode:ODClientActivityMode
    /**The text for the status. */
    text:string,
    /**Additional text for the status. (visible below 'text') */
    state:string,
}

/**## ODJsonConfig_DefaultMessageSettingsType `interface`
 * This interface is an object which has all properties for the "system"."messages".... object in the `general.json` config!
 */
export interface ODJsonConfig_DefaultMessageSettingsType {
    /**Enable sending DM logs to the ticket creator for this action. */
    dm:boolean,
    /**Enable sending logsto the log channel for this action. */
    logs:boolean
}

/**## ODJsonConfig_DefaultCmdPermissionSettingsType `type`
 * This type is a collection of command permission settings for the "system"."permissions".... object in the `general.json` config!
 */
export type ODJsonConfig_DefaultCmdPermissionSettingsType = "admin"|"everyone"|"none"|string

/**## ODJsonConfig_DefaultInfo `interface`
 * This object contains a few URLs and metadata for the config.
 */
export interface ODJsonConfig_DefaultInfo {
    /**A link to the Open Ticket documentation. */
    support:string,
    /**A link to the DJdj Development discord server. */
    discord:string,
    /**The version of Open Ticket this config is compatible with. */
    version:string
}

/**## ODJsonConfig_DefaultSystemLogs `interface`
 * All settings related to the log channel.
 */
export interface ODJsonConfig_DefaultSystemLogs {
    /**Enable logging. Individual actions should still be added via the `"system"."messages"..."logs"` */
    enabled:boolean,
    /**The channel to send logs to. */
    channel:string
}

/**## ODJsonConfig_DefaultSystemLimits `interface`
 * All settings related to global ticket limits.
 */
export interface ODJsonConfig_DefaultSystemLimits {
    /**Enable global ticket limits. */
    enabled:boolean,
    /**The maximum amount of tickets that are allowed in the server at the same time. */
    globalMaximum:number,
    /**The maximum amount of tickets that a user is allowed to create at the same time. */
    userMaximum:number
}

/**## ODJsonConfig_DefaultSystemChannelTopic `interface`
 * All global channel topic settings.
 */
export interface ODJsonConfig_DefaultSystemChannelTopic {
    /**Show the option name in the channel topic. */
    showOptionName:boolean,
    /**Show the option description in the channel topic. */
    showOptionDescription:boolean,
    /**Show the option topic text in the channel topic (configured in the options config). */
    showOptionTopic:boolean,
    /**Show the current priority in the channel topic (auto-updated). */
    showPriority:boolean,
    /**Show the current close/reopen status in the channel topic (auto-updated). */
    showClosed:boolean,
    /**Show the current claim status in the channel topic (auto-updated). */
    showClaimed:boolean,
    /**Show the current pin status in the channel topic (auto-updated). */
    showPinned:boolean,
    /**Show the creator of the ticket in the channel topic (auto-updated on transfer). */
    showCreator:boolean,
    /**Show the first 5 participants of the ticket in the channel topic (auto-updated). */
    showParticipants:boolean
}

/**## ODJsonConfig_DefaultSystemPermissions `interface`
 * Configure permissions for all Open Ticket commands & actions.
 */
export interface ODJsonConfig_DefaultSystemPermissions {
    help:ODJsonConfig_DefaultCmdPermissionSettingsType,
    panel:ODJsonConfig_DefaultCmdPermissionSettingsType,
    ticket:ODJsonConfig_DefaultCmdPermissionSettingsType,
    close:ODJsonConfig_DefaultCmdPermissionSettingsType,
    delete:ODJsonConfig_DefaultCmdPermissionSettingsType,
    reopen:ODJsonConfig_DefaultCmdPermissionSettingsType,
    claim:ODJsonConfig_DefaultCmdPermissionSettingsType,
    unclaim:ODJsonConfig_DefaultCmdPermissionSettingsType,
    pin:ODJsonConfig_DefaultCmdPermissionSettingsType,
    unpin:ODJsonConfig_DefaultCmdPermissionSettingsType,
    move:ODJsonConfig_DefaultCmdPermissionSettingsType,
    rename:ODJsonConfig_DefaultCmdPermissionSettingsType,
    add:ODJsonConfig_DefaultCmdPermissionSettingsType,
    remove:ODJsonConfig_DefaultCmdPermissionSettingsType,
    blacklist:ODJsonConfig_DefaultCmdPermissionSettingsType,
    stats:ODJsonConfig_DefaultCmdPermissionSettingsType,
    clear:ODJsonConfig_DefaultCmdPermissionSettingsType,
    autoclose:ODJsonConfig_DefaultCmdPermissionSettingsType,
    autodelete:ODJsonConfig_DefaultCmdPermissionSettingsType,
    transfer:ODJsonConfig_DefaultCmdPermissionSettingsType,
    topic:ODJsonConfig_DefaultCmdPermissionSettingsType,
    priority:ODJsonConfig_DefaultCmdPermissionSettingsType,
}

/**## ODJsonConfig_DefaultSystemMessages `interface`
 * Configure dm & log messages for all Open Ticket commands & actions.
 */
export interface ODJsonConfig_DefaultSystemMessages {
    creation:ODJsonConfig_DefaultMessageSettingsType,
    closing:ODJsonConfig_DefaultMessageSettingsType,
    deleting:ODJsonConfig_DefaultMessageSettingsType,
    reopening:ODJsonConfig_DefaultMessageSettingsType,
    claiming:ODJsonConfig_DefaultMessageSettingsType,
    pinning:ODJsonConfig_DefaultMessageSettingsType,
    adding:ODJsonConfig_DefaultMessageSettingsType,
    removing:ODJsonConfig_DefaultMessageSettingsType,
    renaming:ODJsonConfig_DefaultMessageSettingsType,
    moving:ODJsonConfig_DefaultMessageSettingsType,
    blacklisting:ODJsonConfig_DefaultMessageSettingsType,
    transferring:ODJsonConfig_DefaultMessageSettingsType,
    topicChange:ODJsonConfig_DefaultMessageSettingsType,
    priorityChange:ODJsonConfig_DefaultMessageSettingsType,
    reactionRole:ODJsonConfig_DefaultMessageSettingsType,
}

/**## ODJsonConfig_DefaultSystem `interface`
 * All settings related to the ticket system.
 */
export interface ODJsonConfig_DefaultSystem {
    /**Prefer slash-commands over text-commands when displaying them in menu's and messages. */
    preferSlashOverText:boolean,
    /**Reply with "unknown command" when the prefix is used without a valid command. */
    sendErrorOnUnknownCommand:boolean,
    /**Display the question fields (in a ticket message) in code blocks. */
    questionFieldsInCodeBlock:boolean,
    /**Display embed fields together with question fields (in a ticket message). */
    displayFieldsWithQuestions:boolean,
    /**Show global admins roles together with ticket admins in panel embeds. */
    showGlobalAdminsInPanelRoles:boolean,
    /**Disable the (✅❌) buttons and directly run the action. */
    disableVerifyBars:boolean,
    /**Display error embeds/messages with red instead of the default bot color. */
    useRedErrorEmbeds:boolean,
    /**Always show the reason field in embeds, even when there is no reason provided. */
    alwaysShowReason:boolean,
    /**The emoji style used in the bot. This will affect all embeds, titles & messages in the bot. */
    emojiStyle:"before"|"after"|"double"|"disabled",
    /**The emoji used when pinning tickets. This is '📌' by default. */
    pinEmoji:string,
    
    /**Reply with an ephemeral message when a ticket is created. */
    replyOnTicketCreation:boolean,
    /**Reply with an ephemeral message when reaction roles are changed. */
    replyOnReactionRole:boolean,
    /**Ask for the priority of this ticket on ticket creation. This will happen in a dropdown in the ticket message. */
    askPriorityOnTicketCreation:boolean,
    /**Remove all participants (except admins) from the ticket when it's closed. */
    removeParticipantsOnClose:boolean,
    /**Disable autoclose for a ticket when it has been closed and re-opened. */
    disableAutocloseAfterReopen:boolean,
    /**Only allow autodelete when the ticket is already closed. */
    autodeleteRequiresClosedTicket:boolean,
    /**When enabled, only global admins are able to delete a ticket without transcript. */
    adminOnlyDeleteWithoutTranscript:boolean,
    /**Only allow ticket closing when at least 1 message has been sent by the creator. (admins are able to bypass) */
    allowCloseBeforeMessage:boolean,
    /**Only allow ticket closing when at least 1 message has been sent by a global or ticket admin. (admins are able to bypass) */
    allowCloseBeforeAdminMessage:boolean,
    /**Use a translated config checker in the console. */
    useTranslatedConfigChecker:boolean,
    /**Pin the (first) ticket message in the channel. This simulates old behaviour like Open Ticket v1, v2 & v3. */
    pinFirstTicketMessage:boolean,
    
    /**Enable/disable the ticket claim & unclaim button in the ticket message. */
    enableTicketClaimButtons:boolean,
    /**Enable/disable the ticket close & re-open button in the ticket message. */
    enableTicketCloseButtons:boolean,
    /**Enable/disable the ticket pin & unpin button in the ticket message. */
    enableTicketPinButtons:boolean,
    /**Enable/disable the ticket delete button in the ticket message. */
    enableTicketDeleteButtons:boolean,
    /**Enable/disable the "with reason" button for all actions in the ticket message. */
    enableTicketActionWithReason:boolean,
    /**Enable/disable the delete without transcript feature (button & /delete command). */
    enableDeleteWithoutTranscript:boolean,

    /**All settings related to the log channel. */
    logs:ODJsonConfig_DefaultSystemLogs,
    
    /**All settings related to global ticket limits. */
    limits:ODJsonConfig_DefaultSystemLimits,

    /**All global channel topic settings. */
    channelTopic:ODJsonConfig_DefaultSystemChannelTopic,

    /**Configure permissions for all Open Ticket commands & actions. */
    permissions:ODJsonConfig_DefaultSystemPermissions,

    /**Configure dm & log messages for all Open Ticket commands & actions. */
    messages:ODJsonConfig_DefaultSystemMessages
}

/**## ODJsonConfig_DefaultGeneralData `interface`
 * All contents of the `general.json` config file.
 */
export interface ODJsonConfig_DefaultGeneralData {
    /**This object contains a few URLs and metadata for the config. */
    _INFO:ODJsonConfig_DefaultInfo,
    
    /**The token of the bot. (Empty when using `tokenFromENV`) */
    token:string,
    /**Use the token from the `.env` file as `TOKEN=xxxxx`. */
    tokenFromENV:boolean,

    /**The main (hex) color used in almost every embed in the bot. */
    mainColor:discord.ColorResolvable|string,
    /**The language to use. Can be the id of the language or the id without the prefix when using `opendiscord:...`. */
    language:string,
    /**The prefix used in all text-commands. */
    prefix:string,
    /**The id of the discord server where the bot is used. */
    serverId:string,
    /**A list of discord role ids which are able to access all tickets & commands. */
    globalAdmins:string[],

    /**Are slash commands enabled? */
    slashCommands:boolean,
    /**Are text commands enabled? */
    textCommands:boolean,

    /**All settings related to the status of the bot. */
    status:ODJsonConfig_DefaultStatusType,

    /**All settings related to the ticket system. */
    system:ODJsonConfig_DefaultSystem
}

/**## ODJsonConfig_DefaultGeneral `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `general.json` config!
 */
export class ODJsonConfig_DefaultGeneral extends ODJsonConfig {
    declare data: ODJsonConfig_DefaultGeneralData
}

/**## ODJsonConfig_DefaultOptionType `interface`
 * This interface is an object which has all basic properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionType {
    /**The id of this option. */
    id:string,
    /**The name of this option. */
    name:string,
    /**The description of this option. */
    description:string,
    /**The type of this option. This type also determines the other option-specific variables. */
    type:"ticket"|"website"|"role",
    /**All settings related to the button for the 3 option types. */
    button:{
        /**The emoji of the button. (can also be empty) */
        emoji:string,
        /**The label of the button (can also be empty) */
        label:string
    }
}

/**## ODJsonConfig_DefaultOptionButtonSettingsType `interface`
 * This interface is an object which has all button settings for ticket & reaction role options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionButtonSettingsType {
    /**The emoji of the button. (can also be empty) */
    emoji:string,
    /**The label of the button (can also be empty) */
    label:string,
    /**The color of the button (not available in options with the 'website' type!) */
    color:ODValidButtonColor
}

/**## ODJsonConfig_DefaultOptionEmbedSettingsType `interface`
 * This interface is an object which has all message embed settings for ticket options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionEmbedSettingsType {
    /**Is this embed enabled? */
    enabled:boolean,
    /**The title of the embed. */
    title:string,
    /**The description of this embed. */
    description:string,
    /**A custom color for this embed. (The default bot color is used when empty) */
    customColor:discord.ColorResolvable|string,

    /**A URL to an image displayed in the embed. */
    image:string,
    /**A URL to a thumbnail displayed in the embed. */
    thumbnail:string,
    /**A list of fields displayed in the embed. */
    fields:{
        /**The name of this field. */
        name:string,
        /**The value of this field. => empty not allowed */
        value:string,
        inline:boolean
    }[],
    /**Enable setting the timestamp of the embed to the current time. */
    timestamp:boolean
}

/**## ODJsonConfig_DefaultOptionPingSettingsType `interface`
 * This interface is an object which has all message ping settings for ticket options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionPingSettingsType {
    /**Ping `@here`. */
    "@here":boolean,
    /**Ping `@everyone`. */
    "@everyone":boolean,
    /**A list of custom discord role ids to ping. */
    custom:string[]
}

/**## ODJsonConfig_DefaultOptionTicketChannelType `interface`
 * All settings related to the ticket channel itself in a ticket option.
 */
export interface ODJsonConfig_DefaultOptionTicketChannelType {
    /**The prefix used in the name of this ticket channel. */
    prefix:string,
    /**The type of suffix used in the name of this ticket channel. */
    suffix:"user-name"|"user-nickname"|"user-id"|"random-number"|"random-hex"|"counter-dynamic"|"counter-fixed",
    /**An optional discord category id to create this ticket in. */
    category:string,
    /**An optional discord category id to move this ticket to when closed. */
    closedCategory:string,
    /**An optional discord category id to create this ticket in when the primary one is full (max. 50 tickets). */
    backupCategory:string,
    /**A list of discord category ids to move this ticket to when claimed by a specific user. */
    claimedCategory:{
        /**The user which claimed the ticket. */
        user:string,
        /**The category to move the ticket to when claimed by this user. */
        category:string
    }[],
    /**The channel topic shown at the top of the channel in discord. */
    topic:string
}

/**## ODJsonConfig_DefaultOptionTicketType `interface`
 * This interface is an object which has all ticket properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionTicketType extends ODJsonConfig_DefaultOptionType {
    type:"ticket",
    button:ODJsonConfig_DefaultOptionButtonSettingsType,
    /**A list of discord role ids which are able to access this ticket type & use commands. */
    ticketAdmins:string[],
    /**A list of discord role ids which are able to access this ticket type but can't write in the chat. */
    readonlyAdmins:string[],
    /**When enabled, blacklisted users can still create this ticket type. (used for appeals, etc) */
    allowCreationByBlacklistedUsers:boolean,
    /**A list of valid question ids from the `questions.json` config. */
    questions:string[],
    /**All settings related to the ticket channel itself. */
    channel:ODJsonConfig_DefaultOptionTicketChannelType,
    /**All settings related to the message sent in DM to the creator when the ticket is created. */
    dmMessage:{
        /**Enable this message. */
        enabled:boolean,
        /**The raw text contents of this message. (empty for embed only) */
        text:string,
        /**The embed of this message. */
        embed:ODJsonConfig_DefaultOptionEmbedSettingsType
    },
    /**All settings related to the message sent in the ticket channel when the ticket is created. */
    ticketMessage:{
        /**Enable this message. */
        enabled:boolean,
        /**The raw text contents of this message. (empty for embed only) */
        text:string,
        /**The embed of this message. */
        embed:ODJsonConfig_DefaultOptionEmbedSettingsType,
        /**Additional ping/mention settings for this ticket channel. */
        ping:ODJsonConfig_DefaultOptionPingSettingsType
    },
    /**All settings related to autoclosing this ticket type. */
    autoclose:{
        /**Enable autoclosing when the ticket is inactive for the set duration of time. */
        enableInactiveHours:boolean,
        /**The amount of hours this ticket is required to be inactive for. */
        inactiveHours:number,
        /**Enable autoclosing when the creator of the ticket leaves the server. */
        enableUserLeave:boolean,
        /**Disable autoclosing when the ticket is claimed by someone. */
        disableOnClaim:boolean
    },
    /**All settings related to autodeleting this ticket type. */
    autodelete:{
        /**Enable autodeleting when the ticket is inactive for the set duration of time. */
        enableInactiveDays:boolean,
        /**The amount of days this ticket is required to be inactive for. */
        inactiveDays:number,
        /**Enable autodeleting when the creator of the ticket leaves the server. */
        enableUserLeave:boolean,
        /**Disable autodeleting when the ticket is claimed by someone. */
        disableOnClaim:boolean
    },
    /**All settings related to the cooldown of this ticket type. */
    cooldown:{
        /**Enable cooldown (per user) */
        enabled:boolean,
        /**The amount of minutes a user needs to wait before being able to create a ticket again. */
        cooldownMinutes:number
    },
    /**All settings related to the limits of this ticket type. */
    limits:{
        /**Enable option ticket limits. */
        enabled:boolean,
        /**The maximum amount of tickets of this type that are allowed in the server at the same time. */
        globalMaximum:number,
        /**The maximum amount of tickets of this type that a user is allowed to create at the same time. */
        userMaximum:number
    },
    /**All settings related to the slow mode of this ticket type. */
    slowMode:{
        /**Enable channel slow mode. */
        enabled:boolean,
        /**The amount of seconds users need to wait between sending messages. */
        slowModeSeconds:number
    }
}

/**## ODJsonConfig_DefaultOptionWebsiteType `interface`
 * This interface is an object which has all website properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionWebsiteType extends ODJsonConfig_DefaultOptionType {
    type:"website",
    /**The URL this button will point to. */
    url:string
}

/**## ODJsonConfig_DefaultOptionRoleType `interface`
 * This interface is an object which has all reaction role properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionRoleType extends ODJsonConfig_DefaultOptionType {
    type:"role",
    button:ODJsonConfig_DefaultOptionButtonSettingsType,
    /**All roles which will be affected by this button. */
    roles:string[],
    /**The mode determines what will happen with the affected roles on the user. */
    mode:ODRoleUpdateMode,
    /**A list of roles to remove from the user when given at least one of the affected roles. */
    removeRolesOnAdd:string[],
    /**Automatically add these roles when the user joins the server. */
    addOnMemberJoin:boolean
}

/**## ODJsonConfig_DefaultOptionsData `type`
 * All contents of the `options.json` config file.
 */
export type ODJsonConfig_DefaultOptionsData = (ODJsonConfig_DefaultOptionTicketType|ODJsonConfig_DefaultOptionWebsiteType|ODJsonConfig_DefaultOptionRoleType)[]

/**## ODJsonConfig_DefaultOptions `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `options.json` config!
 */
export class ODJsonConfig_DefaultOptions extends ODJsonConfig {
    declare data: ODJsonConfig_DefaultOptionsData
}

/**## ODJsonConfig_DefaultPanelEmbedSettingsType `interface`
 * This interface is an object which has all message embed settings for panels in the `panels.json` config!
 */
export interface ODJsonConfig_DefaultPanelEmbedSettingsType {
    /**Is this embed enabled? */
    enabled:boolean,
    /**The title of the embed. */
    title:string,
    /**The description of this embed. */
    description:string,
    
    /**A custom color for this embed. (The default bot color is used when empty) */
    customColor:discord.ColorResolvable|string,
    /**An optional URL used in the title of the embed. */
    url:string,

    /**A URL to an image displayed in the embed. */
    image:string,
    /**A URL to a thumbnail displayed in the embed. */
    thumbnail:string,
    
    /**The footer of this embed. */
    footer:string,
    /**A list of fields displayed in the embed. (except when using "describeOptionsInEmbedFields") */
    fields:{
        /**The name of this field. */
        name:string,
        /**The value of this field. => empty not allowed */
        value:string,
        inline:boolean
    }[],
    /**Enable setting the timestamp of the embed to the current time. */
    timestamp:boolean
}

/**## ODJsonConfig_DefaultPanelSettingsType `interface`
 * This interface is a collection of additional settings for extra customisation in a panel.
 */
export interface ODJsonConfig_DefaultPanelSettingsType {
    /**The placeholder used in the dropdown when enabled. */
    dropdownPlaceholder:string,

    /**Enable a max tickets warning in the text contents. */
    enableMaxTicketsWarningInText:boolean,
    /**Enable a max tickets warning in the embed. */
    enableMaxTicketsWarningInEmbed:boolean,

    /**The layout/complexity of the describe options feature. */
    describeOptionsLayout:"simple"|"normal"|"detailed",
    /**A custom title for the describe options feature. */
    describeOptionsCustomTitle:string,
    /**Describe the options in the text contents. */
    describeOptionsInText:boolean,
    /**Describe the options in the embed fields. */
    describeOptionsInEmbedFields:boolean,
    /**Describe the options in the embed description. */
    describeOptionsInEmbedDescription:boolean
}

/**## ODJsonConfig_DefaultPanelType `interface`
 * This interface is an object which has all properties for panels in the `panels.json` config!
 */
export interface ODJsonConfig_DefaultPanelType {
    /**The id of this panel. */
    id:string,
    /**The name of this panel. */
    name:string,
    /**When enabled, the panel uses a dropdown instead of buttons. */
    dropdown:boolean,
    /**A list of valid options ids from the `options.json` config. */
    options:string[],

    /**The raw text contents of this panel. (empty for embed only) */
    text:string,
    /**The embed of this panel. */
    embed:ODJsonConfig_DefaultPanelEmbedSettingsType,
    /**A collection of additional settings for extra customisation in a panel. */
    settings:ODJsonConfig_DefaultPanelSettingsType
}

/**## ODJsonConfig_DefaultPanelsData `type`
 * All contents of the `panels.json` config file.
 */
export type ODJsonConfig_DefaultPanelsData = ODJsonConfig_DefaultPanelType[]

/**## ODJsonConfig_DefaultPanels `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `panels.json` config!
 */
export class ODJsonConfig_DefaultPanels extends ODJsonConfig {
    declare data: ODJsonConfig_DefaultPanelsData
}

/**## ODJSonConfig_DefaultQuestionLengthSettings `interface`
 * This interface is a collection of settings related to length validation in a question.
 */
export interface ODJSonConfig_DefaultQuestionLengthSettings {
    /**Enable text length verification. */
    enabled:boolean,
    /**The minimum text input length. */
    min:number,
    /**The maximum text input length. */
    max:number
}

/**## ODJsonConfig_DefaultShortQuestionType `interface`
 * This interface is an object which has all properties for short questions in the `questions.json` config!
 */
export interface ODJsonConfig_DefaultShortQuestionType {
    /**The id of this question. */
    id:string,
    /**The name of this question. */
    name:string,
    /**The type of this question. */
    type:"short",

    /**Is this question required? */
    required:boolean,
    /**A placeholder for the question. */
    placeholder:string,
    /**A collection of settings related to length validation in a question. */
    length:ODJSonConfig_DefaultQuestionLengthSettings
}

/**## ODJsonConfig_DefaultParagraphQuestionType `interface`
 * This interface is an object which has all properties for paragraph questions in the `questions.json` config!
 */
export interface ODJsonConfig_DefaultParagraphQuestionType {
    /**The id of this question. */
    id:string,
    /**The name of this question. */
    name:string,
    /**The type of this question. */
    type:"paragraph",

    /**Is this question required? */
    required:boolean,
    /**A placeholder for the question. */
    placeholder:string,
    /**A collection of settings related to length validation in a question. */
    length:ODJSonConfig_DefaultQuestionLengthSettings
}

/**## ODJsonConfig_DefaultQuestionsData `type`
 * All contents of the `questions.json` config file.
 */
export type ODJsonConfig_DefaultQuestionsData = (ODJsonConfig_DefaultShortQuestionType|ODJsonConfig_DefaultParagraphQuestionType)[]

/**## ODJsonConfig_DefaultQuestions `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `questions.json` config!
 */
export class ODJsonConfig_DefaultQuestions extends ODJsonConfig {
    declare data: ODJsonConfig_DefaultQuestionsData
}

/**## ODJsonConfig_DefaultTranscriptsTextLayout `interface`
 * This interface contains the layout of the text transcripts.
 */
export interface ODJsonConfig_DefaultTranscriptsTextLayout {
    /**The layout/complexity of the text transcripts. */
    layout:"simple"|"normal"|"detailed",
    /**Include stats in the transcript. */
    includeStats:boolean,
    /**Include user & message ids in the transcript. */
    includeIds:boolean,
    /**Include embeds in the transcript. */
    includeEmbeds:boolean,
    /**Include files in the transcript. */
    includeFiles:boolean,
    /**Include bot messages in the transcript. */
    includeBotMessages:boolean,

    /**How to name the transcript file? */
    fileMode:"custom"|"channel-name"|"channel-id"|"user-name"|"user-id",
    /**A custom name for the transcript file (when using `"custom"`) */
    customFileName:string
}

/**## ODJsonConfig_DefaultTranscriptsHtmlLayout `interface`
 * This interface contains the layout of the HTML transcripts.
 */
export interface ODJsonConfig_DefaultTranscriptsHtmlLayout {
    /**Settings related to the background. */
    background:{
        /**Enable a custom background. */
        enableCustomBackground:boolean,
        /**The background (hex) color. */
        backgroundColor:string,
        /**The background image url. */
        backgroundImage:string
    },
    /**Settings related to the header. */
    header:{
        /**Enable a custom header. */
        enableCustomHeader:boolean,
        /**The background (hex) color of the header. */
        backgroundColor:string,
        /**The deco color (horizontal line) of the header. */
        decoColor:string,
        /**The text color of the header. */
        textColor:string
    },
    /**Settings related to the stats section. */
    stats:{
        /**Enable a custom stats section. */
        enableCustomStats:false,
        /**The background color of the stats section. */
        backgroundColor:string,
        /**The key text color of the stats section. */
        keyTextColor:string,
        /**The value text color of the stats section. */
        valueTextColor:string,
        /**The background color of the hide button in the stats section. */
        hideBackgroundColor:string,
        /**The text color of the hide button in the stats section. */
        hideTextColor:string
    },
    /**Settings related to the favicon. */
    favicon:{
        /**Enable a custom background. */
        enableCustomFavicon:boolean,
        /**A link to the custom favicon. */
        imageUrl:string
    }
}

/**## ODJsonConfig_DefaultTranscriptsData `interface`
 * All contents of the `transcripts.json` config file.
 */
export interface ODJsonConfig_DefaultTranscriptsData {
    /**All general settings related to transcripts. */
    general:{
        /**Are transcripts enabled? */
        enabled:boolean,

        /**Enable sending the generated transcript in a channel. */
        enableChannel:boolean,
        /**Enable sending the generated transcript to the DM of the ticket creator. */
        enableCreatorDM:boolean,
        /**Enable sending the generated transcript to the DM of the participants. */
        enableParticipantDM:boolean,
        /**Enable sending the generated transcript to the DM of all admins which were active in the ticket. */
        enableActiveAdminDM:boolean,
        /**Enable sending the generated transcript to the DM of all admins which were assigned to the ticket. */
        enableEveryAdminDM:boolean,

        /**A discord channel id for the `"enableChannel"` setting. */
        channel:string,
        /**Want to use text or HTML transcripts? */
        mode:"html"|"text"
    },
    /**All settings related to the embed from the transcripts. (UNIMPLEMENTED!!) */
    embedSettings:{
        /**Unimplemented feature */
        customColor:discord.ColorResolvable|string,
        /**Unimplemented feature */
        listAllParticipants:boolean,
        /**Unimplemented feature */
        includeTicketStats:boolean
    },
    /**The layout of the text transcripts. */
    textTranscriptStyle:ODJsonConfig_DefaultTranscriptsTextLayout,
    /**The layout of the HTML transcripts. */
    htmlTranscriptStyle:ODJsonConfig_DefaultTranscriptsHtmlLayout
}


/**## ODJsonConfig_DefaultTranscripts `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `transcripts.json` config!
 */
export class ODJsonConfig_DefaultTranscripts extends ODJsonConfig {
    declare data: ODJsonConfig_DefaultTranscriptsData
}