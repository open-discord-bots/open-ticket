import {opendiscord, api, utilities} from "../../index"
import * as fjs from "formatted-json-stringify"

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

export const loadAllConfigs = async () => {
    const devconfigFlag = opendiscord.flags.get("opendiscord:dev-config")
    const isDevconfig = devconfigFlag ? devconfigFlag.value : false
    
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:general","general.json",(isDevconfig) ? "./devconfig/" : "./config/",defaultGeneralFormatter))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:questions","questions.json",(isDevconfig) ? "./devconfig/" : "./config/",defaultQuestionsFormatter))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:options","options.json",(isDevconfig) ? "./devconfig/" : "./config/",defaultOptionsFormatter))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:panels","panels.json",(isDevconfig) ? "./devconfig/" : "./config/",defaultPanelsFormatter))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:transcripts","transcripts.json",(isDevconfig) ? "./devconfig/" : "./config/",defaultTranscriptsFormatter))
}

//FORMATTERS
export const defaultGeneralFormatter = new fjs.ObjectFormatter(null,true,[
    new fjs.ObjectFormatter("_INFO",true,[
        new fjs.PropertyFormatter("support"),
        new fjs.PropertyFormatter("discord"),
        new fjs.PropertyFormatter("version"),
    ]),
    new fjs.TextFormatter(""),
    new fjs.PropertyFormatter("token"),
    new fjs.PropertyFormatter("tokenFromENV"),
    new fjs.TextFormatter(""),
    new fjs.PropertyFormatter("mainColor"),
    new fjs.PropertyFormatter("language"),
    new fjs.PropertyFormatter("prefix"),
    new fjs.PropertyFormatter("serverId"),
    new fjs.ArrayFormatter("globalAdmins",false,new fjs.PropertyFormatter(null)),
    new fjs.TextFormatter(""),
    new fjs.PropertyFormatter("slashCommands"),
    new fjs.PropertyFormatter("textCommands"),
    new fjs.TextFormatter(""),
    new fjs.ObjectFormatter("status",true,[
        new fjs.PropertyFormatter("enabled"),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("mode"),
        new fjs.PropertyFormatter("text"),
        new fjs.PropertyFormatter("state"),
    ]),
    new fjs.TextFormatter(""),
    new fjs.ObjectFormatter("system",true,[
        new fjs.PropertyFormatter("preferSlashOverText"),
        new fjs.PropertyFormatter("sendErrorOnUnknownCommand"),
        new fjs.PropertyFormatter("questionFieldsInCodeBlock"),
        new fjs.PropertyFormatter("displayFieldsWithQuestions"),
        new fjs.PropertyFormatter("showGlobalAdminsInPanelRoles"),
        new fjs.PropertyFormatter("disableVerifyBars"),
        new fjs.PropertyFormatter("useRedErrorEmbeds"),
        new fjs.PropertyFormatter("alwaysShowReason"),
        new fjs.PropertyFormatter("emojiStyle"),
        new fjs.PropertyFormatter("pinEmoji"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("replyOnTicketCreation"),
        new fjs.PropertyFormatter("replyOnReactionRole"),
        new fjs.PropertyFormatter("askPriorityOnTicketCreation"),
        new fjs.PropertyFormatter("removeParticipantsOnClose"),
        new fjs.PropertyFormatter("disableAutocloseAfterReopen"),
        new fjs.PropertyFormatter("autodeleteRequiresClosedTicket"),
        new fjs.PropertyFormatter("adminOnlyDeleteWithoutTranscript"),
        new fjs.PropertyFormatter("allowCloseBeforeMessage"),
        new fjs.PropertyFormatter("allowCloseBeforeAdminMessage"),
        new fjs.PropertyFormatter("useTranslatedConfigChecker"),
        new fjs.PropertyFormatter("pinFirstTicketMessage"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("enableTicketClaimButtons"),
        new fjs.PropertyFormatter("enableTicketCloseButtons"),
        new fjs.PropertyFormatter("enableTicketPinButtons"),
        new fjs.PropertyFormatter("enableTicketDeleteButtons"),
        new fjs.PropertyFormatter("enableTicketActionWithReason"),
        new fjs.PropertyFormatter("enableDeleteWithoutTranscript"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("logs",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("channel"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("limits",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("globalMaximum"),
            new fjs.PropertyFormatter("userMaximum"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("channelTopic",true,[
            new fjs.PropertyFormatter("showOptionName"),
            new fjs.PropertyFormatter("showOptionDescription"),
            new fjs.PropertyFormatter("showOptionTopic"),
            new fjs.PropertyFormatter("showPriority"),
            new fjs.PropertyFormatter("showClosed"),
            new fjs.PropertyFormatter("showClaimed"),
            new fjs.PropertyFormatter("showPinned"),
            new fjs.PropertyFormatter("showCreator"),
            new fjs.PropertyFormatter("showParticipants"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("permissions",true,[
            new fjs.PropertyFormatter("help"),
            new fjs.PropertyFormatter("panel"),
            new fjs.PropertyFormatter("ticket"),
            new fjs.PropertyFormatter("close"),
            new fjs.PropertyFormatter("delete"),
            new fjs.PropertyFormatter("reopen"),
            new fjs.PropertyFormatter("claim"),
            new fjs.PropertyFormatter("unclaim"),
            new fjs.PropertyFormatter("pin"),
            new fjs.PropertyFormatter("unpin"),
            new fjs.PropertyFormatter("move"),
            new fjs.PropertyFormatter("rename"),
            new fjs.PropertyFormatter("add"),
            new fjs.PropertyFormatter("remove"),
            new fjs.PropertyFormatter("blacklist"),
            new fjs.PropertyFormatter("stats"),
            new fjs.PropertyFormatter("clear"),
            new fjs.PropertyFormatter("autoclose"),
            new fjs.PropertyFormatter("autodelete"),
            new fjs.PropertyFormatter("transfer"),
            new fjs.PropertyFormatter("topic"),
            new fjs.PropertyFormatter("priority"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("messages",true,[
            new fjs.DefaultFormatter("creation",false),
            new fjs.DefaultFormatter("closing",false),
            new fjs.DefaultFormatter("deleting",false),
            new fjs.DefaultFormatter("reopening",false),
            new fjs.DefaultFormatter("claiming",false),
            new fjs.DefaultFormatter("pinning",false),
            new fjs.DefaultFormatter("adding",false),
            new fjs.DefaultFormatter("removing",false),
            new fjs.DefaultFormatter("renaming",false),
            new fjs.DefaultFormatter("moving",false),
            new fjs.DefaultFormatter("blacklisting",false),
            new fjs.DefaultFormatter("transferring",false),
            new fjs.DefaultFormatter("topicChange",false),
            new fjs.DefaultFormatter("priorityChange",false),
            new fjs.DefaultFormatter("reactionRole",false)
        ]),
    ]),
])

export const defaultQuestionsFormatter = new fjs.ArrayFormatter(null,true,new fjs.ObjectSwitchFormatter(null,[
    {key:"type",value:"short",formatter:new fjs.ObjectFormatter(null,true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("required"),
        new fjs.PropertyFormatter("placeholder"),
        new fjs.ObjectFormatter("length",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("min"),
            new fjs.PropertyFormatter("max"),
        ]),
    ])},
    {key:"type",value:"paragraph",formatter:new fjs.ObjectFormatter(null,true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("required"),
        new fjs.PropertyFormatter("placeholder"),
        new fjs.ObjectFormatter("length",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("min"),
            new fjs.PropertyFormatter("max"),
        ]),
    ])}
]))


export const defaultOptionsFormatter = new fjs.ArrayFormatter(null,true,new fjs.ObjectSwitchFormatter(null,[
    {key:"type",value:"ticket",formatter:new fjs.ObjectFormatter(null,true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description"),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button",true,[
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label"),
            new fjs.PropertyFormatter("color"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ArrayFormatter("ticketAdmins",false,new fjs.PropertyFormatter(null)),
        new fjs.ArrayFormatter("readonlyAdmins",false,new fjs.PropertyFormatter(null)),
        new fjs.PropertyFormatter("allowCreationByBlacklistedUsers"),
        new fjs.ArrayFormatter("questions",false,new fjs.PropertyFormatter(null)),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("channel",true,[
            new fjs.PropertyFormatter("prefix"),
            new fjs.PropertyFormatter("suffix"),
            new fjs.PropertyFormatter("category"),
            new fjs.PropertyFormatter("backupCategory"),
            new fjs.PropertyFormatter("closedCategory"),
            new fjs.ArrayFormatter("claimedCategory",true,new fjs.ObjectFormatter(null,false,[
                new fjs.PropertyFormatter("user"),
                new fjs.PropertyFormatter("category"),
            ])),
            new fjs.PropertyFormatter("topic"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("dmMessage",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("text"),
            new fjs.ObjectFormatter("embed",true,[
                new fjs.PropertyFormatter("enabled"),
                new fjs.PropertyFormatter("title"),
                new fjs.PropertyFormatter("description"),
                new fjs.PropertyFormatter("customColor"),
                new fjs.TextFormatter(""),
                new fjs.PropertyFormatter("image"),
                new fjs.PropertyFormatter("thumbnail"),
                new fjs.ArrayFormatter("fields",true,new fjs.ObjectFormatter(null,false,[
                    new fjs.PropertyFormatter("name"),
                    new fjs.PropertyFormatter("value"),
                    new fjs.PropertyFormatter("inline"),
                ])),
                new fjs.PropertyFormatter("timestamp"),
            ]),
        ]),
        new fjs.ObjectFormatter("ticketMessage",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("text"),
            new fjs.ObjectFormatter("embed",true,[
                new fjs.PropertyFormatter("enabled"),
                new fjs.PropertyFormatter("title"),
                new fjs.PropertyFormatter("description"),
                new fjs.PropertyFormatter("customColor"),
                new fjs.TextFormatter(""),
                new fjs.PropertyFormatter("image"),
                new fjs.PropertyFormatter("thumbnail"),
                new fjs.ArrayFormatter("fields",true,new fjs.ObjectFormatter(null,false,[
                    new fjs.PropertyFormatter("name"),
                    new fjs.PropertyFormatter("value"),
                    new fjs.PropertyFormatter("inline"),
                ])),
                new fjs.PropertyFormatter("timestamp"),
            ]),
            new fjs.ObjectFormatter("ping",true,[
                new fjs.PropertyFormatter("@here"),
                new fjs.PropertyFormatter("@everyone"),
                new fjs.ArrayFormatter("custom",true,new fjs.PropertyFormatter(null)),
            ]),
        ]),
        new fjs.ObjectFormatter("autoclose",true,[
            new fjs.PropertyFormatter("enableInactiveHours"),
            new fjs.PropertyFormatter("inactiveHours"),
            new fjs.PropertyFormatter("enableUserLeave"),
            new fjs.PropertyFormatter("disableOnClaim"),
        ]),
        new fjs.ObjectFormatter("autodelete",true,[
            new fjs.PropertyFormatter("enableInactiveDays"),
            new fjs.PropertyFormatter("inactiveDays"),
            new fjs.PropertyFormatter("enableUserLeave"),
            new fjs.PropertyFormatter("disableOnClaim"),
        ]),
        new fjs.ObjectFormatter("cooldown",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("cooldownMinutes"),
        ]),
        new fjs.ObjectFormatter("limits",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("globalMaximum"),
            new fjs.PropertyFormatter("userMaximum"),
        ]),
        new fjs.ObjectFormatter("slowMode",true,[
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("slowModeSeconds"),
        ]),
    ])},
    {key:"type",value:"website",formatter:new fjs.ObjectFormatter(null,true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description"),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button",true,[
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("url"),
    ])},
    {key:"type",value:"role",formatter:new fjs.ObjectFormatter(null,true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description"),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button",true,[
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label"),
            new fjs.PropertyFormatter("color"),
        ]),
        new fjs.TextFormatter(""),
        new fjs.ArrayFormatter("roles",false,new fjs.PropertyFormatter(null)),
        new fjs.PropertyFormatter("mode"),
        new fjs.ArrayFormatter("removeRolesOnAdd",false,new fjs.PropertyFormatter(null)),
        new fjs.PropertyFormatter("addOnMemberJoin"),
    ])}
]))

export const defaultPanelsFormatter = new fjs.ArrayFormatter(null,true,new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("id"),
    new fjs.PropertyFormatter("name"),
    new fjs.PropertyFormatter("dropdown"),
    new fjs.ArrayFormatter("options",false,new fjs.PropertyFormatter(null)),
    new fjs.TextFormatter(""),
    new fjs.PropertyFormatter("text"),
    new fjs.ObjectFormatter("embed",true,[
        new fjs.PropertyFormatter("enabled"),
        new fjs.PropertyFormatter("title"),
        new fjs.PropertyFormatter("description"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("customColor"),
        new fjs.PropertyFormatter("url"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("image"),
        new fjs.PropertyFormatter("thumbnail"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("footer"),
        new fjs.ArrayFormatter("fields",true,new fjs.ObjectFormatter(null,false,[
            new fjs.PropertyFormatter("name"),
            new fjs.PropertyFormatter("value"),
            new fjs.PropertyFormatter("inline"),
        ])),
        new fjs.PropertyFormatter("timestamp"),
    ]),
    new fjs.ObjectFormatter("settings",true,[
        new fjs.PropertyFormatter("dropdownPlaceholder"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("enableMaxTicketsWarningInText"),
        new fjs.PropertyFormatter("enableMaxTicketsWarningInEmbed"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("describeOptionsLayout"),
        new fjs.PropertyFormatter("describeOptionsCustomTitle"),
        new fjs.PropertyFormatter("describeOptionsInText"),
        new fjs.PropertyFormatter("describeOptionsInEmbedFields"),
        new fjs.PropertyFormatter("describeOptionsInEmbedDescription"),
    ]),
]))

export const defaultTranscriptsFormatter = new fjs.ObjectFormatter(null,true,[
    new fjs.ObjectFormatter("general",true,[
        new fjs.PropertyFormatter("enabled"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("enableChannel"),
        new fjs.PropertyFormatter("enableCreatorDM"),
        new fjs.PropertyFormatter("enableParticipantDM"),
        new fjs.PropertyFormatter("enableActiveAdminDM"),
        new fjs.PropertyFormatter("enableEveryAdminDM"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("channel"),
        new fjs.PropertyFormatter("mode"),
    ]),
    new fjs.ObjectFormatter("embedSettings",true,[
        new fjs.PropertyFormatter("customColor"),
        new fjs.PropertyFormatter("listAllParticipants"),
        new fjs.PropertyFormatter("includeTicketStats"),
    ]),
    new fjs.ObjectFormatter("textTranscriptStyle",true,[
        new fjs.PropertyFormatter("layout"),
        new fjs.PropertyFormatter("includeStats"),
        new fjs.PropertyFormatter("includeIds"),
        new fjs.PropertyFormatter("includeEmbeds"),
        new fjs.PropertyFormatter("includeFiles"),
        new fjs.PropertyFormatter("includeBotMessages"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("fileMode"),
        new fjs.PropertyFormatter("customFileName"),
    ]),
    new fjs.ObjectFormatter("htmlTranscriptStyle",true,[
        new fjs.ObjectFormatter("background",true,[
            new fjs.PropertyFormatter("enableCustomBackground"),
            new fjs.PropertyFormatter("backgroundColor"),
            new fjs.PropertyFormatter("backgroundImage"),
        ]),
        new fjs.ObjectFormatter("header",true,[
            new fjs.PropertyFormatter("enableCustomHeader"),
            new fjs.PropertyFormatter("backgroundColor"),
            new fjs.PropertyFormatter("decoColor"),
            new fjs.PropertyFormatter("textColor"),
        ]),
        new fjs.ObjectFormatter("stats",true,[
            new fjs.PropertyFormatter("enableCustomStats"),
            new fjs.PropertyFormatter("backgroundColor"),
            new fjs.PropertyFormatter("keyTextColor"),
            new fjs.PropertyFormatter("valueTextColor"),
            new fjs.PropertyFormatter("hideBackgroundColor"),
            new fjs.PropertyFormatter("hideTextColor"),
        ]),
        new fjs.ObjectFormatter("favicon",true,[
            new fjs.PropertyFormatter("enableCustomFavicon"),
            new fjs.PropertyFormatter("imageUrl"),
        ]),
    ]),
])