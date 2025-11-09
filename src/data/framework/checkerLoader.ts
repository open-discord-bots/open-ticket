import {opendiscord, api, utilities} from "../../index"

const generalConfig = opendiscord.configs.get("opendiscord:general")

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

export const loadAllConfigCheckers = async () => {
    opendiscord.checkers.add(new api.ODChecker("opendiscord:general",opendiscord.checkers.storage,0,opendiscord.configs.get("opendiscord:general"),defaultGeneralStructure,{cliDisplayName:"General Config",cliDisplayDescription:"Configure the bot token, status, colors, permissions & more."}))
    opendiscord.checkers.add(new api.ODChecker("opendiscord:questions",opendiscord.checkers.storage,2,opendiscord.configs.get("opendiscord:questions"),defaultQuestionsStructure,{cliDisplayName:"Questions Config",cliDisplayDescription:"Create, modify & delete questions which are used in options."}))
    opendiscord.checkers.add(new api.ODChecker("opendiscord:options",opendiscord.checkers.storage,1,opendiscord.configs.get("opendiscord:options"),defaultOptionsStructure,{cliDisplayName:"Options Config",cliDisplayDescription:"Create, modify & delete options which are used in panels."}))
    opendiscord.checkers.add(new api.ODChecker("opendiscord:panels",opendiscord.checkers.storage,0,opendiscord.configs.get("opendiscord:panels"),defaultPanelsStructure,{cliDisplayName:"Panels Config",cliDisplayDescription:"Create, modify & delete panels which can be spawned in discord."}))
    opendiscord.checkers.add(new api.ODChecker("opendiscord:transcripts",opendiscord.checkers.storage,0,opendiscord.configs.get("opendiscord:transcripts"),defaultTranscriptsStructure,{cliDisplayName:"Transcript Config",cliDisplayDescription:"Configure everything related to transcripts."}))
}

export const loadAllConfigCheckerFunctions = async () => {
    opendiscord.checkers.functions.add(new api.ODCheckerFunction("opendiscord:unused-options",defaultUnusedOptionsFunction))
    opendiscord.checkers.functions.add(new api.ODCheckerFunction("opendiscord:unused-questions",defaultUnusedQuestionsFunction))
    opendiscord.checkers.functions.add(new api.ODCheckerFunction("opendiscord:dropdown-options",defaultDropdownOptionsFunction))
}

export const loadAllConfigCheckerTranslations = async () => {
    if ((generalConfig && generalConfig.data.system && generalConfig.data.system.useTranslatedConfigChecker) ? generalConfig.data.system.useTranslatedConfigChecker : false){
        registerDefaultCheckerSystemTranslations(opendiscord.checkers.translation,opendiscord.languages) //translate checker system text
        registerDefaultCheckerMessageTranslations(opendiscord.checkers.translation,opendiscord.languages) //translate checker messages
        registerDefaultCheckerCustomTranslations(opendiscord.checkers.translation,opendiscord.languages) //translate custom checker messages
    }
}

//GLOBAL FUNCTIONS
export const registerDefaultCheckerSystemTranslations = (tm:api.ODCheckerTranslationRegister_Default,lm:api.ODLanguageManager_Default) => {
    //SYSTEM
    //tm.quickTranslate(lm,"checker.system.headerOpenTicket","other","opendiscord:header-openticket") //OPEN TICKET (ignore)
    tm.quickTranslate(lm,"checker.system.typeError","other","opendiscord:type-error") // [ERROR] (ignore)
    tm.quickTranslate(lm,"checker.system.typeWarning","other","opendiscord:type-warning") // [WARNING] (ignore)
    tm.quickTranslate(lm,"checker.system.typeInfo","other","opendiscord:type-info") // [INFO] (ignore)
    tm.quickTranslate(lm,"checker.system.headerConfigChecker","other","opendiscord:header-configchecker") // CONFIG CHECKER
    tm.quickTranslate(lm,"checker.system.headerDescription","other","opendiscord:header-description") // check for errors in your config files!
    tm.quickTranslate(lm,"checker.system.footerError","other","opendiscord:footer-error") // the bot won't start until all {0}'s are fixed!
    tm.quickTranslate(lm,"checker.system.footerWarning","other","opendiscord:footer-warning") // it's recommended to fix all {0}'s before starting!
    tm.quickTranslate(lm,"checker.system.footerSupport","other","opendiscord:footer-support") // SUPPORT: {0} - DOCS: {1}
    tm.quickTranslate(lm,"checker.system.compactInformation","other","opendiscord:compact-information") // use {0} for more information!
    tm.quickTranslate(lm,"checker.system.dataPath","other","opendiscord:data-path") // path
    tm.quickTranslate(lm,"checker.system.dataDocs","other","opendiscord:data-docs") // docs
    tm.quickTranslate(lm,"checker.system.dataMessages","other","opendiscord:data-message") // message
}

export const registerDefaultCheckerMessageTranslations = (tm:api.ODCheckerTranslationRegister_Default,lm:api.ODLanguageManager_Default) => {
    //STRUCTURES
    tm.quickTranslate(lm,"checker.messages.invalidType","message","opendiscord:invalid-type") // This property needs to be the type: {0}!
    tm.quickTranslate(lm,"checker.messages.propertyMissing","message","opendiscord:property-missing") // The property {0} is missing from this object!
    tm.quickTranslate(lm,"checker.messages.propertyOptional","message","opendiscord:property-optional") // The property {0} is optional in this object!
    tm.quickTranslate(lm,"checker.messages.objectDisabled","message","opendiscord:object-disabled") // This object is disabled, enable it using {0}!
    tm.quickTranslate(lm,"checker.messages.nullInvalid","message","opendiscord:null-invalid") // This property can't be null!
    tm.quickTranslate(lm,"checker.messages.switchInvalidType","message","opendiscord:switch-invalid-type") // This needs to be one of the following types: {0}!
    tm.quickTranslate(lm,"checker.messages.objectSwitchInvalid","message","opendiscord:object-switch-invalid-type") // This object needs to be one of the following types: {0}!

    tm.quickTranslate(lm,"checker.messages.stringTooShort","message","opendiscord:string-too-short") // This string can't be shorter than {0} characters!
    tm.quickTranslate(lm,"checker.messages.stringTooLong","message","opendiscord:string-too-long") // This string can't be longer than {0} characters!
    tm.quickTranslate(lm,"checker.messages.stringLengthInvalid","message","opendiscord:string-length-invalid") // This string needs to be {0} characters long!
    tm.quickTranslate(lm,"checker.messages.stringStartsWith","message","opendiscord:string-starts-with") // This string needs to start with {0}!
    tm.quickTranslate(lm,"checker.messages.stringEndsWith","message","opendiscord:string-ends-with") // This string needs to end with {0}!
    tm.quickTranslate(lm,"checker.messages.stringContains","message","opendiscord:string-contains") // This string needs to contain {0}!
    tm.quickTranslate(lm,"checker.messages.stringInvertedContains","message","opendiscord:string-inverted-contains") // This string is not allowed to contain {0}!
    tm.quickTranslate(lm,"checker.messages.stringChoices","message","opendiscord:string-choices") // This string can only be one of the following values: {0}!
    tm.quickTranslate(lm,"checker.messages.stringLowercase","message","opendiscord:string-lowercase") // This string must be written in lowercase only!
    tm.quickTranslate(lm,"checker.messages.stringUppercase","message","opendiscord:string-uppercase") // This string must be written in uppercase only!
    tm.quickTranslate(lm,"checker.messages.stringSpecialCharacters","message","opendiscord:string-special-characters") // This string is not allowed to contain any special characters! (a-z, 0-9 & space only)
    tm.quickTranslate(lm,"checker.messages.stringNoSpaces","message","opendiscord:string-no-spaces") // This string is not allowed to contain spaces!
    tm.quickTranslate(lm,"checker.messages.stringRegex","message","opendiscord:string-regex") // This string is invalid!
    tm.quickTranslate(lm,"checker.messages.stringCapitalWord","message","opendiscord:string-capital-word") // It's recommended that each word in this string starts with a capital letter!
    tm.quickTranslate(lm,"checker.messages.stringCapitalSentence","message","opendiscord:string-capital-sentence") // It looks like some sentences in this string don't start with a capital letter!
    tm.quickTranslate(lm,"checker.messages.stringPunctuation","message","opendiscord:string-punctuation") // It looks like the sentence in this string doesn't end with a punctuation mark!

    tm.quickTranslate(lm,"checker.messages.numberNan","message","opendiscord:number-nan") // This number can't be NaN (Not A Number)!
    tm.quickTranslate(lm,"checker.messages.numberTooShort","message","opendiscord:number-too-short") // This number can't be shorter than {0} characters!
    tm.quickTranslate(lm,"checker.messages.numberTooLong","message","opendiscord:number-too-long") // This number can't be longer than {0} characters!
    tm.quickTranslate(lm,"checker.messages.numberLengthInvalid","message","opendiscord:number-length-invalid") // This number needs to be {0} characters long!
    tm.quickTranslate(lm,"checker.messages.numberTooSmall","message","opendiscord:number-too-small") // This number needs to be at least {0}!
    tm.quickTranslate(lm,"checker.messages.numberTooLarge","message","opendiscord:number-too-large") // This number needs to be at most {0}!
    tm.quickTranslate(lm,"checker.messages.numberNotEqual","message","opendiscord:number-not-equal") // This number needs to be {0}!
    tm.quickTranslate(lm,"checker.messages.numberStep","message","opendiscord:number-step") // This number needs to be a multiple of {0}!
    tm.quickTranslate(lm,"checker.messages.numberStepOffset","message","opendiscord:number-step-offset") // This number needs to be a multiple of {0} starting with {1}!
    tm.quickTranslate(lm,"checker.messages.numberStartsWith","message","opendiscord:number-starts-with") // This number needs to start with {0}!
    tm.quickTranslate(lm,"checker.messages.numberEndsWith","message","opendiscord:number-ends-with") // This number needs to end with {0}!
    tm.quickTranslate(lm,"checker.messages.numberContains","message","opendiscord:number-contains") // This number needs to contain {0}!
    tm.quickTranslate(lm,"checker.messages.numberInvertedContains","message","opendiscord:number-inverted-contains") // This number is not allowed to contain {0}!
    tm.quickTranslate(lm,"checker.messages.numberChoices","message","opendiscord:number-choices") // This number can only be one of the following values: {0}!
    tm.quickTranslate(lm,"checker.messages.numberFloat","message","opendiscord:number-float") // This number can't be a decimal!
    tm.quickTranslate(lm,"checker.messages.numberNegative","message","opendiscord:number-negative") // This number can't be negative!
    tm.quickTranslate(lm,"checker.messages.numberPositive","message","opendiscord:number-positive") // This number can't be positive!
    tm.quickTranslate(lm,"checker.messages.numberZero","message","opendiscord:number-zero") // This number can't be zero!

    tm.quickTranslate(lm,"checker.messages.booleanTrue","message","opendiscord:boolean-true") // This boolean can't be true!
    tm.quickTranslate(lm,"checker.messages.booleanFalse","message","opendiscord:boolean-false") // This boolean can't be false!

    tm.quickTranslate(lm,"checker.messages.arrayEmptyDisabled","message","opendiscord:array-empty-disabled") // This array isn't allowed to be empty!
    tm.quickTranslate(lm,"checker.messages.arrayEmptyRequired","message","opendiscord:array-empty-required") // This array is required to be empty!
    tm.quickTranslate(lm,"checker.messages.arrayTooShort","message","opendiscord:array-too-short") // This array needs to have a length of at least {0}!
    tm.quickTranslate(lm,"checker.messages.arrayTooLong","message","opendiscord:array-too-long") // This array needs to have a length of at most {0}!
    tm.quickTranslate(lm,"checker.messages.arrayLengthInvalid","message","opendiscord:array-length-invalid") // This array needs to have a length of {0}!
    tm.quickTranslate(lm,"checker.messages.arrayInvalidTypes","message","opendiscord:array-invalid-types") // This array can only contain the following types: {0}!
    tm.quickTranslate(lm,"checker.messages.arrayDouble","message","opendiscord:array-double") // This array doesn't allow the same value twice!

    tm.quickTranslate(lm,"checker.messages.discordInvalidId","message","opendiscord:discord-invalid-id") // This is an invalid discord {0} id!
    tm.quickTranslate(lm,"checker.messages.discordInvalidIdOptions","message","opendiscord:discord-invalid-id-options") // This is an invalid discord {0} id! You can also use one of these: {1}!
    tm.quickTranslate(lm,"checker.messages.discordInvalidToken","message","opendiscord:discord-invalid-token") // This is an invalid discord token (syntactically)!
    tm.quickTranslate(lm,"checker.messages.colorInvalid","message","opendiscord:color-invalid") // This is an invalid hex color!
    tm.quickTranslate(lm,"checker.messages.emojiTooShort","message","opendiscord:emoji-too-short") // This string needs to have at least {0} emoji's!
    tm.quickTranslate(lm,"checker.messages.emojiTooLong","message","opendiscord:emoji-too-long") // This string needs to have at most {0} emoji's!
    tm.quickTranslate(lm,"checker.messages.emojiCustom","message","opendiscord:emoji-custom") // This emoji can't be a custom discord emoji!
    tm.quickTranslate(lm,"checker.messages.emojiInvalid","message","opendiscord:emoji-invalid") // This is an invalid emoji!
    tm.quickTranslate(lm,"checker.messages.urlInvalid","message","opendiscord:url-invalid") // This url is invalid!
    tm.quickTranslate(lm,"checker.messages.urlInvalidHttp","message","opendiscord:url-invalid-http") // This url can only use the https:// protocol!
    tm.quickTranslate(lm,"checker.messages.urlInvalidProtocol","message","opendiscord:url-invalid-protocol") // This url can only use the http:// & https:// protocols!
    tm.quickTranslate(lm,"checker.messages.urlInvalidHostname","message","opendiscord:url-invalid-hostname") // This url has a disallowed hostname!
    tm.quickTranslate(lm,"checker.messages.urlInvalidExtension","message","opendiscord:url-invalid-extension") // This url has an invalid extension! Choose between: {0}!
    tm.quickTranslate(lm,"checker.messages.urlInvalidPath","message","opendiscord:url-invalid-path") // This url has an invalid path!
    tm.quickTranslate(lm,"checker.messages.idNotUnique","message","opendiscord:id-not-unique") // This id isn't unique, use another id instead!
    tm.quickTranslate(lm,"checker.messages.idNonExistent","message","opendiscord:id-non-existent") // The id {0} doesn't exist!
}

export const registerDefaultCheckerCustomTranslations = (tm:api.ODCheckerTranslationRegister_Default,lm:api.ODLanguageManager_Default) => {
    //CUSTOM
    tm.quickTranslate(lm,"checker.messages.invalidLanguage","message","opendiscord:invalid-language") // This is an invalid language!
    tm.quickTranslate(lm,"checker.messages.invalidButton","message","opendiscord:invalid-button") // This button needs to have at least an {0} or {1}!
    tm.quickTranslate(lm,"checker.messages.unusedOption","message","opendiscord:unused-option") // The option {0} isn't used anywhere!
    tm.quickTranslate(lm,"checker.messages.unusedQuestion","message","opendiscord:unused-question") // The question {0} isn't used anywhere!
    tm.quickTranslate(lm,"checker.messages.dropdownOption","message","opendiscord:dropdown-option") // A panel with dropdown enabled can only contain options of the 'ticket' type!
    tm.quickTranslate(lm,"checker.messages.customInvalidVersion","message","opendiscord:invalid-version") // The version specified in your config does not match! Make sure you have updated the config to the latest version!
}

//UTILITY FUNCTIONS
const createMsgStructure = (id:api.ODValidId,displayName:string) => {
    return new api.ODCheckerObjectStructure(id,{children:[
        {key:"dm",checker:new api.ODCheckerBooleanStructure("opendiscord:msg-dm",{cliInitDefaultValue:false,cliDisplayName:"DM Enabled",cliDisplayDescription:"Will this action be sent in DM to the creator of the ticket?"})},
        {key:"logs",checker:new api.ODCheckerBooleanStructure("opendiscord:msg-logs",{cliInitDefaultValue:true,cliDisplayName:"Logs Enabled",cliDisplayDescription:"Will this action be sent in the Discord log channel?"})},
    ],cliDisplayName:displayName,cliDisplayDescription:"Configure which places this action gets logged/sent to."})
}
const createTicketEmbedStructure = (id:api.ODValidId) => {
    return new api.ODCheckerEnabledObjectStructure(id,{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure(id,{children:[
        {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-embed-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the embed of this message."})},
        {key:"title",checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-text",{maxLength:256,cliDisplayName:"Title",cliDisplayDescription:"The title of this embed."})},
        {key:"description",checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-description",{maxLength:4096,cliDisplayName:"Description",cliDisplayDescription:"The description of this embed."})},
        {key:"customColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:ticket-embed-color",true,true,{cliDisplayName:"Custom Color",cliDisplayDescription:"Set a custom color for this embed. When empty, the default bot color will be used."})},
        
        {key:"image",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:ticket-embed-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]},{cliDisplayName:"Image",cliDisplayDescription:"Add an image to the embed using an image URL."})},
        {key:"thumbnail",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:ticket-embed-thumbnail",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]},{cliDisplayName:"Thumbnail",cliDisplayDescription:"Add a thumbnail to the embed using an image URL."})},
        {key:"fields",checker:new api.ODCheckerArrayStructure("opendiscord:ticket-embed-fields",{allowedTypes:["object"],cliDisplayPropertyName:"embed field",propertyChecker:new api.ODCheckerObjectStructure("opendiscord:ticket-embed-fields",{children:[
            {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-field-name",{minLength:1,maxLength:256,cliDisplayName:"Field Name",cliDisplayDescription:"The name/title of this embed field."})},
            {key:"value",checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-field-value",{minLength:1,maxLength:1024,cliDisplayName:"Field Value",cliDisplayDescription:"The value/description of this embed field."})},
            {key:"inline",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-embed-field-inline",{cliDisplayName:"Field Inline",cliDisplayDescription:"Should this field be displayed inline with other fields?"})}
        ],cliDisplayName:"Field",cliDisplayDescription:"Customise and configure an embed field."}),cliDisplayName:"Fields",cliDisplayDescription:"Customise and configure embed fields."})},
        {key:"timestamp",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-embed-timestamp",{cliDisplayName:"Timestamp",cliDisplayDescription:"Add a timestamp to the embed."})}
    ],cliDisplayName:"Message Embed",cliDisplayDescription:"Configure the embed of this message."}),cliInitDefaultValue:{enabled:false,title:"",description:"",customColor:"",image:"",thumbnail:"",fields:[],timestamp:false},cliDisplayName:"Message Embed",cliDisplayDescription:"Configure the embed of this message."})
}
const createTicketPingStructure = (id:api.ODValidId) => {
    return new api.ODCheckerObjectStructure(id,{children:[
        {key:"@here",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-ping-here",{cliDisplayName:"@here Ping",cliDisplayDescription:"Enable/disable an '@here' ping."})},
        {key:"@everyone",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-ping-everyone",{cliDisplayName:"@everyone Ping",cliDisplayDescription:"Enable/disable an '@everyone' ping."})},
        {key:"custom",checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:ticket-ping-custom","role",[],{allowDoubles:false,cliDisplayPropertyName:"custom role id",cliDisplayName:"Custom Role Ping",cliDisplayDescription:"Choose your own roles to ping in this message."},{cliDisplayName:"Custom Role",cliDisplayDescription:"The discord role ID of a custom mention/ping."})},
    ],cliInitDefaultValue:{"@here":true,"@everyone":false,custom:[],cliDisplayName:"Message Pings",cliDisplayDescription:"Configure the pings/mentions of this message."}})
}
const createPanelEmbedStructure = (id:api.ODValidId) => {
    return new api.ODCheckerEnabledObjectStructure(id,{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure(id,{children:[
        {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-embed-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the embed of this panel."})},
        {key:"title",checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-text",{maxLength:256,cliDisplayName:"Title",cliDisplayDescription:"The title of this embed."})},
        {key:"description",checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-description",{maxLength:4096,cliDisplayName:"Description",cliDisplayDescription:"The description of this embed."})},
        {key:"customColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:panel-embed-color",true,true,{cliDisplayName:"Custom Color",cliDisplayDescription:"Set a custom color for this embed. When empty, the default bot color will be used."})},
        {key:"url",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:panel-embed-url",true,{allowHttp:false},{cliDisplayName:"URL",cliDisplayDescription:"Set a URL which will be displayed in the title of the embed."})},

        {key:"image",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:panel-embed-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]},{cliDisplayName:"Image",cliDisplayDescription:"Add an image to the embed using an image URL."})},
        {key:"thumbnail",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:panel-embed-thumbnail",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]},{cliDisplayName:"Thumbnail",cliDisplayDescription:"Add a thumbnail to the embed using an image URL."})},
        
        {key:"footer",checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-footer",{maxLength:2048,cliDisplayName:"Footer",cliDisplayDescription:"The footer of this embed."})},
        {key:"fields",checker:new api.ODCheckerArrayStructure("opendiscord:panel-embed-fields",{allowedTypes:["object"],cliDisplayPropertyName:"embed field",propertyChecker:new api.ODCheckerObjectStructure("opendiscord:panel-embed-fields",{children:[
            {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-field-name",{minLength:1,maxLength:256,cliDisplayName:"Field Name",cliDisplayDescription:"The name/title of this embed field."})},
            {key:"value",checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-field-value",{minLength:1,maxLength:1024,cliDisplayName:"Field Value",cliDisplayDescription:"The value/description of this embed field."})},
            {key:"inline",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-embed-field-inline",{cliDisplayName:"Field Inline",cliDisplayDescription:"Should this field be displayed inline with other fields?"})}
        ],cliDisplayName:"Field",cliDisplayDescription:"Customise and configure an embed field."}),cliDisplayName:"Fields",cliDisplayDescription:"Customise and configure embed fields."})},
        {key:"timestamp",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-embed-timestamp",{cliDisplayName:"Timestamp",cliDisplayDescription:"Add a timestamp to the embed."})}
    ],cliDisplayName:"Panel Embed",cliDisplayDescription:"Configure the embed of this panel."}),cliInitDefaultValue:{enabled:false,title:"",description:"",customColor:"",url:"",image:"",thumbnail:"",footer:"",fields:[],timestamp:false},cliDisplayName:"Panel Embed",cliDisplayDescription:"Configure the embed of this panel."})
}

function loadFromEnv(){
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (generalConfig.data && generalConfig.data.tokenFromENV && typeof generalConfig.data.tokenFromENV == "boolean") return generalConfig.data.tokenFromENV
    else return false
}

//STRUCTURES
export const defaultGeneralStructure = new api.ODCheckerObjectStructure("opendiscord:general",{children:[
    //INFO
    {key:"_INFO",cliHideInEditMode:true,checker:new api.ODCheckerObjectStructure("opendiscord:info",{children:[
        {key:"support",checker:new api.ODCheckerStringStructure("opendiscord:info-support",{choices:["https://otdocs.dj-dj.be"]})},
        {key:"discord",checker:new api.ODCheckerStringStructure("opendiscord:info-discord",{choices:["https://discord.dj-dj.be"]})},
        {key:"version",checker:new api.ODCheckerStringStructure("opendiscord:info-version",{custom(checker,value,locationTrace,locationId,locationDocs) {
            const lt = checker.locationTraceDeref(locationTrace)
            
            if (typeof value != "string") return false
            else if (value != "open-ticket-"+opendiscord.versions.get("opendiscord:version").toString()){
                checker.createMessage("opendiscord:invalid-version","warning","The version specified in your config does not match! Make sure you have updated the config to the latest version!",lt,null,[],locationId,locationDocs)
                return false
            }else return true
        },})},
    ]})},

    //BASIC
    {key:"token",checker:(loadFromEnv()) ? new api.ODCheckerStringStructure("opendiscord:token-disabled",{cliDisplayName:"Token",cliDisplayDescription:"The token of your discord bot."}) : new api.ODCheckerCustomStructure_DiscordToken("opendiscord:token",{cliDisplayName:"Token",cliDisplayDescription:"The token of your discord bot."})},
    {key:"tokenFromENV",checker:new api.ODCheckerBooleanStructure("opendiscord:token-env",{cliDisplayName:"Token From ENV",cliDisplayDescription:"Use the token from the .env file instead of general.json."})},
    {key:"mainColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:main-color",true,false,{cliDisplayName:"Main Color",cliDisplayDescription:"The main color of your bot, used in almost all embeds."})},
    {key:"language",checker:new api.ODCheckerStringStructure("opendiscord:language",{
        custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string") return false
            else if (!opendiscord.defaults.getDefault("languageList").includes(value)){
                checker.createMessage("opendiscord:invalid-language","error","This is an invalid language!",lt,null,[],locationId,locationDocs)
                return false
            }else return true
        },
        cliAutocompleteList:opendiscord.defaults.getDefault("languageList"),
        cliDisplayName:"Language",
        cliDisplayDescription:"The language of the bot. Visit README.md for a list of available translations."
    })},
    {key:"prefix",checker:new api.ODCheckerStringStructure("opendiscord:prefix",{minLength:1,cliDisplayName:"Prefix",cliDisplayDescription:"The prefix used for the text-commands from the bot."})},
    {key:"serverId",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:server-id","server",false,[],{cliDisplayName:"Server Id",cliDisplayDescription:"The ID of the discord server you will be using this bot in."})},
    {key:"globalAdmins",checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:global-admins","role",[],{allowDoubles:false,cliDisplayPropertyName:"global admin role",cliDisplayName:"Global Admin Roles",cliDisplayDescription:"A list of role IDs that are able to interact with all commands and tickets."},{cliDisplayName:"Global Admin Role",cliDisplayDescription:"The discord role ID of a global admin."})},
    {key:"slashCommands",checker:new api.ODCheckerBooleanStructure("opendiscord:slash-commands",{cliDisplayName:"Enable Slash Commands",cliDisplayDescription:"Enable/disable slash commands in the bot. When disabled, the commands will not be displayed."})},
    {key:"textCommands",checker:new api.ODCheckerBooleanStructure("opendiscord:text-commands",{cliDisplayName:"Enable Text Commands",cliDisplayDescription:"Enable/disable text commands in the bot. (Disabling is recommended in large servers)"})},

    //STATUS
    {key:"status",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:status",{
        property:"enabled",
        enabledValue:true,
        checker:new api.ODCheckerObjectStructure("opendiscord:status",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:status-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the status. When disabled, the bot will be online without any status."})},
            {key:"type",checker:new api.ODCheckerStringStructure("opendiscord:status-type",{choices:["listening","watching","playing","custom"],cliDisplayName:"Type",cliDisplayDescription:"The type of status: Listening, Watching, Playing or Custom."})},
            {key:"mode",checker:new api.ODCheckerStringStructure("opendiscord:status-mode",{choices:["online","invisible","idle","dnd"],cliDisplayName:"Mode",cliDisplayDescription:"The profile status/mode of the bot: Online, Invisible, Idle or Do Not Disturb."})},
            {key:"text",checker:new api.ODCheckerStringStructure("opendiscord:status-text",{minLength:1,maxLength:128,cliDisplayName:"Text",cliDisplayDescription:"The text displayed in the status."})},
            {key:"state",checker:new api.ODCheckerStringStructure("opendiscord:status-state",{maxLength:128,cliDisplayName:"State",cliDisplayDescription:"Additional text displayed below the status 'text'."})},
        ],cliDisplayName:"Bot Status",cliDisplayDescription:"Manage the status of the bot."}),
        cliDisplayName:"Bot Status",
        cliDisplayDescription:"Manage the status of the bot."
    })},

    //SYSTEM
    {key:"system",checker:new api.ODCheckerObjectStructure("opendiscord:system",{children:[
        {key:"preferSlashOverText",checker:new api.ODCheckerBooleanStructure("opendiscord:prefer-slash-over-text",{cliDisplayName:"Prefer Slash Over Text",cliDisplayDescription:"Prefer displaying slash commands over text commands in help menus."})},
        {key:"sendErrorOnUnknownCommand",checker:new api.ODCheckerBooleanStructure("opendiscord:send-error-on-unknown-command",{cliDisplayName:"Send Error On Unknown Command",cliDisplayDescription:"Send an error when using the text-command prefix without a valid command."})},
        {key:"questionFieldsInCodeBlock",checker:new api.ODCheckerBooleanStructure("opendiscord:question-fields-in-code-block",{cliDisplayName:"Questions Fields In Code Blocks",cliDisplayDescription:"Display question fields in code blocks instead of plain text."})},
        {key:"displayFieldsWithQuestions",checker:new api.ODCheckerBooleanStructure("opendiscord:display-fields-with-questions",{cliDisplayName:"Display Fields With Questions",cliDisplayDescription:"Display embed fields together with question fields (in a ticket message)."})},
        {key:"showGlobalAdminsInPanelRoles",checker:new api.ODCheckerBooleanStructure("opendiscord:global-admins-in-panel-roles",{cliDisplayName:"Show Global Admins In Panel Roles",cliDisplayDescription:"Show global admins roles together with ticket admins in panel embeds."})},
        {key:"disableVerifyBars",checker:new api.ODCheckerBooleanStructure("opendiscord:disable-verify-bars",{cliDisplayName:"Disable Verifybars",cliDisplayDescription:"Disable the (✅/❌) verify buttons in all commands. (Not recommended)"})},
        {key:"useRedErrorEmbeds",checker:new api.ODCheckerBooleanStructure("opendiscord:use-red-error-embeds",{cliDisplayName:"Use Red Error Embeds",cliDisplayDescription:"Display all error messages with a red border instead of the default color of the bot."})},
        {key:"alwaysShowReason",checker:new api.ODCheckerBooleanStructure("opendiscord:always-show-reason",{cliDisplayName:"Always Show Reason",cliDisplayDescription:"Always show the reason field in embeds, even when there is no reason provided."})},
        {key:"emojiStyle",checker:new api.ODCheckerStringStructure("opendiscord:emoji-style",{choices:["before","after","double","disabled"],cliDisplayName:"Emoji Style",cliDisplayDescription:"Choose how the bot will display emojis in message titles. (Visit docs for more info)"})},
        {key:"pinEmoji",checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:pin-emoji",1,1,false,{cliDisplayName:"Pin Emoji",cliDisplayDescription:"The emoji used when pinning tickets. This is '📌' by default."})},
        
        {key:"replyOnTicketCreation",checker:new api.ODCheckerBooleanStructure("opendiscord:reply-on-ticket-creation",{cliDisplayName:"Reply On Ticket Creation",cliDisplayDescription:"When enabled, the bot will send an ephemeral reply in the channel of the panel when creating a ticket."})},
        {key:"replyOnReactionRole",checker:new api.ODCheckerBooleanStructure("opendiscord:reply-on-reaction-role",{cliDisplayName:"Reply On Reaction Role",cliDisplayDescription:"When enabled, the bot will send an ephemeral reply in the channel of the panel when using a role button."})},
        {key:"askPriorityOnTicketCreation",checker:new api.ODCheckerBooleanStructure("opendiscord:ask-priority-creation",{cliDisplayName:"Ask Priority On Ticket Creation",cliDisplayDescription:"Ask for the priority of this ticket on ticket creation. This will happen in a dropdown in the ticket message."})},
        {key:"removeParticipantsOnClose",checker:new api.ODCheckerBooleanStructure("opendiscord:remove-participants-on-close",{cliDisplayName:"Remove Participants On Close",cliDisplayDescription:"When enabled, all participants except admins will be removed from the ticket."})},
        {key:"disableAutocloseAfterReopen",checker:new api.ODCheckerBooleanStructure("opendiscord:disable-autoclose-reopen",{cliDisplayName:"Disable Autoclose On Reopen",cliDisplayDescription:"Disable autoclose for a ticket when it has been closed and re-opened."})},
        {key:"autodeleteRequiresClosedTicket",checker:new api.ODCheckerBooleanStructure("opendiscord:autodelete-requires-closed-ticket",{cliDisplayName:"Autodelete Requires Closed Ticket",cliDisplayDescription:"Only allow autodelete when the ticket is already closed."})},
        {key:"adminOnlyDeleteWithoutTranscript",checker:new api.ODCheckerBooleanStructure("opendiscord:adminonly-delete-without-transcript",{cliDisplayName:"Admin-only Delete Without Transcript",cliDisplayDescription:"When enabled, only global admins are able to delete a ticket without transcript."})},
        {key:"allowCloseBeforeMessage",checker:new api.ODCheckerBooleanStructure("opendiscord:allow-close-before-message",{cliDisplayName:"Allow Close Before Message",cliDisplayDescription:"Only allow ticket closing when at least 1 message has been sent by the creator. (admins are able to bypass)"})},
        {key:"allowCloseBeforeAdminMessage",checker:new api.ODCheckerBooleanStructure("opendiscord:allow-close-before-admin-message",{cliDisplayName:"Allow Close Before Admin Message",cliDisplayDescription:"Only allow ticket closing when at least 1 message has been sent by a global or ticket admin. (admins are able to bypass)"})},
        {key:"useTranslatedConfigChecker",checker:new api.ODCheckerBooleanStructure("opendiscord:use-translated-config-checker",{cliDisplayName:"Use Translated Config Checker",cliDisplayDescription:"Use a translated config checker to better understand the errors the bot gives."})},
        {key:"pinFirstTicketMessage",checker:new api.ODCheckerBooleanStructure("opendiscord:pin-first-ticket-message",{cliDisplayName:"Pin First Ticket Message",cliDisplayDescription:"Pin the (first) ticket message in the channel. This simulates old behaviour like Open Ticket v1, v2 & v3."})},

        {key:"enableTicketClaimButtons",checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-claim-buttons",{cliDisplayName:"Enable Ticket Claim Buttons",cliDisplayDescription:"Enable/disable buttons for claiming a ticket. Be aware that this doesn't disable the command!"})},
        {key:"enableTicketCloseButtons",checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-close-buttons",{cliDisplayName:"Enable Ticket Close Buttons",cliDisplayDescription:"Enable/disable buttons for closing a ticket. Be aware that this doesn't disable the command!"})},
        {key:"enableTicketPinButtons",checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-pin-buttons",{cliDisplayName:"Enable Ticket Pin Buttons",cliDisplayDescription:"Enable/disable buttons for pinning a ticket. Be aware that this doesn't disable the command!"})},
        {key:"enableTicketDeleteButtons",checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-delete-buttons",{cliDisplayName:"Enable Ticket Delete Buttons",cliDisplayDescription:"Enable/disable buttons for deleting a ticket. Be aware that this doesn't disable the command!"})},
        {key:"enableTicketActionWithReason",checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-action-with-reason",{cliDisplayName:"Enable Ticket Action With Reason",cliDisplayDescription:"Enable/disable buttons to write an additional reason for all ticket actions."})},
        {key:"enableDeleteWithoutTranscript",checker:new api.ODCheckerBooleanStructure("opendiscord:enable-delete-without-transcript",{cliDisplayName:"Enable Delete Without Transcript",cliDisplayDescription:"Enable/disable the ability to delete tickets without a transcript."})},

        {key:"logs",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:system-logs",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:system-logs",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:logs-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable discord logs in a discord channel."})},
            {key:"channel",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:logs-channel","channel",false,[],{cliDisplayName:"Log Channel",cliDisplayDescription:"The ID of the discord channel to log messages to. You can configure the messages somewhere else."})},
        ],cliDisplayName:"Discord Logs",cliDisplayDescription:"Manage everything related to logs in a discord channel."}),cliDisplayName:"Discord Logs",cliDisplayDescription:"Manage everything related to logs in a discord channel."})},

        {key:"limits",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:limits",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:limits",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:limits-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable global limits."})},
            {key:"globalMaximum",checker:new api.ODCheckerNumberStructure("opendiscord:limits-global",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,cliDisplayName:"Global Maximum",cliDisplayDescription:"The maximum amount of tickets that are able to exist in the server at the same time."})},
            {key:"userMaximum",checker:new api.ODCheckerNumberStructure("opendiscord:limits-user",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,cliDisplayName:"User Maximum",cliDisplayDescription:"The maximum amount of tickets from a specific user that are able to exist in the server at the same time."})}
        ],cliDisplayName:"Global Limits",cliDisplayDescription:"Manage global limits for ticket creation to reduce the workload on your support team."}),cliDisplayName:"Global Limits",cliDisplayDescription:"Manage global limits for ticket creation to reduce the workload on your support team."})},

        {key:"channelTopic",checker:new api.ODCheckerObjectStructure("opendiscord:channel-topic",{children:[
            {key:"showOptionName",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-option-name",{cliDisplayName:"Show Option Name",cliDisplayDescription:"Show the option name in the channel topic."})},
            {key:"showOptionDescription",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-option-description",{cliDisplayName:"Show Option Description",cliDisplayDescription:"Show the option description in the channel topic."})},
            {key:"showOptionTopic",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-option-topic",{cliDisplayName:"Show Option Topic",cliDisplayDescription:"Show the option topic text in the channel topic (configured in the options.json config)."})},
            {key:"showPriority",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-priority",{cliDisplayName:"Show Priority",cliDisplayDescription:"Show the current priority in the channel topic (auto-updated)."})},
            {key:"showClosed",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-closed",{cliDisplayName:"Show Closed Status",cliDisplayDescription:"Show the current close/reopen status in the channel topic (auto-updated)."})},
            {key:"showClaimed",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-claimed",{cliDisplayName:"Show Claimed Status",cliDisplayDescription:"Show the current claim status in the channel topic (auto-updated)."})},
            {key:"showPinned",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-pinned",{cliDisplayName:"Show Pinned Status",cliDisplayDescription:"Show the current pin status in the channel topic (auto-updated)."})},
            {key:"showCreator",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-creator",{cliDisplayName:"Show Creator",cliDisplayDescription:"Show the creator of the ticket in the channel topic (auto-updated on transfer)."})},
            {key:"showParticipants",checker:new api.ODCheckerBooleanStructure("opendiscord:topic-show-participants",{cliDisplayName:"Show Participants",cliDisplayDescription:"Show the first 5 participants of the ticket in the channel topic (auto-updated)."})},
            
        ],cliDisplayName:"Channel Topic",cliDisplayDescription:"Manage stats and text of ticket channel topics."})},

        {key:"permissions",checker:new api.ODCheckerObjectStructure("opendiscord:system-permissions",{children:[
            {key:"help",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-help","role",false,["admin","everyone","none"],{cliDisplayName:"Help",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"panel",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-panel","role",false,["admin","everyone","none"],{cliDisplayName:"Panel",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"ticket",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-ticket","role",false,["admin","everyone","none"],{cliDisplayName:"Ticket",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"close",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-close","role",false,["admin","everyone","none"],{cliDisplayName:"Close",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"delete",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-delete","role",false,["admin","everyone","none"],{cliDisplayName:"Delete",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"reopen",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-reopen","role",false,["admin","everyone","none"],{cliDisplayName:"Reopen",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"claim",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-claim","role",false,["admin","everyone","none"],{cliDisplayName:"Claim",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"unclaim",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-unclaim","role",false,["admin","everyone","none"],{cliDisplayName:"Unclaim",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"pin",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-pin","role",false,["admin","everyone","none"],{cliDisplayName:"Pin",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"unpin",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-unpin","role",false,["admin","everyone","none"],{cliDisplayName:"Unpin",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"move",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-move","role",false,["admin","everyone","none"],{cliDisplayName:"Move",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"rename",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-rename","role",false,["admin","everyone","none"],{cliDisplayName:"Rename",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"add",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-add","role",false,["admin","everyone","none"],{cliDisplayName:"Add User",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"remove",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-remove","role",false,["admin","everyone","none"],{cliDisplayName:"Remove User",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"blacklist",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-blacklist","role",false,["admin","everyone","none"],{cliDisplayName:"Blacklist",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"stats",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-stats","role",false,["admin","everyone","none"],{cliDisplayName:"Stats",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"clear",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-clear","role",false,["admin","everyone","none"],{cliDisplayName:"Clear Tickets",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"autoclose",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-autoclose","role",false,["admin","everyone","none"],{cliDisplayName:"Autoclose",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"autodelete",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-autodelete","role",false,["admin","everyone","none"],{cliDisplayName:"Autodelete",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"transfer",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-transfer","role",false,["admin","everyone","none"],{cliDisplayName:"Transfer",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"topic",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-topic","role",false,["admin","everyone","none"],{cliDisplayName:"Topic",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
            {key:"priority",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-priority","role",false,["admin","everyone","none"],{cliDisplayName:"Priority",cliHideDescriptionInParent:true,cliDisplayDescription:"Set the permissions to 'everyone' for everyone, 'admin' for admin only, 'none' to disable or a custom discord role ID."})},
        ],cliDisplayName:"Permissions",cliDisplayDescription:"Manage all button & command permissions in the bot. (Visit docs for more info)"})},

        {key:"messages",checker:new api.ODCheckerObjectStructure("opendiscord:system-permissions",{children:[
            {key:"creation",checker:createMsgStructure("opendiscord:msg-creation","Ticket Created")},
            {key:"closing",checker:createMsgStructure("opendiscord:msg-closing","Ticket Closed")},
            {key:"deleting",checker:createMsgStructure("opendiscord:msg-deleting","Ticket Deleted")},
            {key:"reopening",checker:createMsgStructure("opendiscord:msg-reopening","Ticket Reopened")},
            {key:"claiming",checker:createMsgStructure("opendiscord:msg-claiming","Ticket Claimed")},
            {key:"pinning",checker:createMsgStructure("opendiscord:msg-pinning","Ticket Pinned")},
            {key:"adding",checker:createMsgStructure("opendiscord:msg-adding","User Added")},
            {key:"removing",checker:createMsgStructure("opendiscord:msg-removing","User Removed")},
            {key:"renaming",checker:createMsgStructure("opendiscord:msg-renaming","Ticket Renamed")},
            {key:"moving",checker:createMsgStructure("opendiscord:msg-moving","Ticket Moved")},
            {key:"blacklisting",checker:createMsgStructure("opendiscord:msg-blacklisting","User Blacklisted")},
            {key:"transferring",checker:createMsgStructure("opendiscord:msg-transferring","Ticket Transferred")},
            {key:"topicChange",checker:createMsgStructure("opendiscord:msg-topic-change","Topic Changed")},
            {key:"priorityChange",checker:createMsgStructure("opendiscord:msg-priority-change","Priority Changed")},
            {key:"reactionRole",checker:createMsgStructure("opendiscord:msg-reaction-role","Reaction Role")},
        ],cliDisplayName:"Messages",cliDisplayDescription:"Manage all messages & DM's for each action of the bot. (Visit docs for more info)"})},
    ],cliDisplayName:"System",cliDisplayDescription:"Configure everything related to the ticket system."})}
],cliDisplayName:"General",cliDisplayDescription:"General settings for the bot."})

export const defaultOptionsStructure = new api.ODCheckerArrayStructure("opendiscord:options",{allowedTypes:["object"],cliDisplayPropertyName:"option",propertyChecker:new api.ODCheckerObjectSwitchStructure("opendiscord:options",{objects:[
    //TICKET
    {name:"Ticket",priority:0,properties:[{key:"type",value:"ticket"}],checker:new api.ODCheckerObjectStructure("opendiscord:ticket",{cliDisplayKeyInParentArray:"name",cliDisplayAdditionalKeysInParentArray:["id","type"],cliInitSkipKeys:["readonlyAdmins"],children:[
        {key:"id",checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:ticket-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40,cliDisplayName:"Id",cliDisplayDescription:"The id of this ticket option. Used in panels."})},
        {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:ticket-name",{minLength:2,maxLength:45,cliDisplayName:"Name",cliDisplayDescription:"The name of this ticket option."})},
        {key:"description",checker:new api.ODCheckerStringStructure("opendiscord:ticket-description",{maxLength:256,cliDisplayName:"Description",cliDisplayDescription:"The description of this ticket option."})},

        //TICKET BUTTON
        {key:"button",checker:new api.ODCheckerObjectStructure("opendiscord:ticket-button",{children:[
            {key:"emoji",checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:ticket-button-emoji",0,1,true,{cliDisplayName:"Emoji",cliDisplayDescription:"The emoji of the button. At least 1 of 2 (emoji/label) must be provided."})},
            {key:"label",checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-label",{maxLength:80,cliDisplayName:"Label",cliDisplayDescription:"The label of the button. At least 1 of 2 (emoji/label) must be provided."})},
            {key:"color",checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-color",{choices:["gray","red","green","blue"],cliDisplayName:"Color",cliDisplayDescription:"The color of the button. Does not apply when using a dropdown panel."})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("opendiscord:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        },cliDisplayName:"Button",cliDisplayDescription:"Customise the button/dropdown layout of this ticket option."})},

        //TICKET ADMINS
        {key:"ticketAdmins",checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:ticket-ticket-admins","role",[],{allowDoubles:false,cliDisplayPropertyName:"ticket admin role",cliDisplayName:"Ticket Admin Roles",cliDisplayDescription:"A list of role IDs that are only able to interact with this ticket option."},{cliDisplayName:"Ticket Admin Role",cliDisplayDescription:"The discord role ID of a ticket admin."})},
        {key:"readonlyAdmins",checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:ticket-readonly-admins","role",[],{allowDoubles:false,cliInitDefaultValue:[],cliDisplayPropertyName:"read-only ticket admin role",cliDisplayName:"Readonly Admin Roles",cliDisplayDescription:"A list of role IDs that are only able to read this ticket option."},{cliDisplayName:"Readonly Admin Role",cliDisplayDescription:"The discord role ID of a readonly admin."})},
        {key:"allowCreationByBlacklistedUsers",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-allow-blacklisted-users",{cliDisplayName:"Allow Creation By Blacklisted Users",cliDisplayDescription:"When enabled, the blacklist doesn't apply to this ticket option/type and users are still able to create a ticket."})},
        {key:"questions",checker:new api.ODCheckerCustomStructure_UniqueIdArray("opendiscord:option-questions","openticket","question-ids","question-ids-used",{allowDoubles:false,maxLength:5,cliDisplayPropertyName:"question",cliDisplayName:"Questions",cliDisplayDescription:"A list of valid question IDs to ask before creating this ticket."},{cliDisplayName:"Question ID",cliDisplayDescription:"A valid question ID from the questions.json config.",cliAutocompleteFunc:async () => {
            const uncheckedRawData = opendiscord.configs.get("opendiscord:questions").data
            if (!Array.isArray(uncheckedRawData)) return null
            const idList = uncheckedRawData.filter((option) => typeof option == "object" && typeof option["id"] == "string").map((option) => option.id)
            return (idList.length > 0) ? idList : null
        }})},

        //TICKET CHANNEL
        {key:"channel",checker:new api.ODCheckerObjectStructure("opendiscord:ticket-channel",{cliInitSkipKeys:["backupCategory","claimedCategory"],children:[
            {key:"prefix",checker:new api.ODCheckerStringStructure("opendiscord:ticket-channel-prefix",{maxLength:25,regex:/^[^\s]*$/,cliDisplayName:"Prefix",cliDisplayDescription:"The prefix of the name of the ticket channel. (e.g. 'question-')"})},
            {key:"suffix",checker:new api.ODCheckerStringStructure("opendiscord:ticket-channel-suffix",{choices:["user-name","user-nickname","user-id","random-number","random-hex","counter-dynamic","counter-fixed"],cliDisplayName:"Suffix",cliDisplayDescription:"The suffix mode to use. The number/text will be appended after the prefix."})},
            
            {key:"category",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-category","category",true,[],{cliDisplayName:"Category",cliDisplayDescription:"The category the ticket will be created in. Leave empty for no category."})},
            {key:"closedCategory",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-closed-category","category",true,[],{cliDisplayName:"Closed Category",cliDisplayDescription:"An additional category where the ticket will be moved to when closed."})},
            {key:"backupCategory",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-backup-category","category",true,[],{cliDisplayName:"Backup Category",cliDisplayDescription:"An additional category where the ticket will be created in when the primary category is full (50 channels)."})},
            {key:"claimedCategory",checker:new api.ODCheckerArrayStructure("opendiscord:ticket-channel-claimed-category",{allowDoubles:false,allowedTypes:["object"],cliDisplayPropertyName:"claim category",propertyChecker:new api.ODCheckerObjectStructure("opendiscord:ticket-channel-claimed-category",{children:[
                {key:"user",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-claimed-user","user",false,[],{cliDisplayName:"User",cliDisplayDescription:"A discord user ID of the ticket claimer."})},
                {key:"category",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-claimed-category","category",false,[],{cliDisplayName:"Category",cliDisplayDescription:"A discord category ID to move the ticket to."})}
            ],cliDisplayName:"Claimed Category",cliDisplayDescription:"A collection of a user ID and a category ID. The ticket will be moved to the category when this user claims the ticket."}),cliDisplayName:"Claimed Categories",cliDisplayDescription:"Add categories to move the ticket to when a user claims a ticket."})},
            {key:"topic",checker:new api.ODCheckerStringStructure("opendiscord:ticket-channel-topic",{cliDisplayName:"Channel Topic",cliDisplayDescription:"The topic text of the ticket channel. Visible in the discord client when general.json 'channelTopic'.'showOptionTopic' is enabled."})},
        ],cliDisplayName:"Channel",cliDisplayDescription:"Manage all settings related to the ticket channel and categories."})},

        //DM MESSAGE
        {key:"dmMessage",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-dm-message",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-dm-message",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-message-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the DM message on ticket creation."})},
            {key:"text",checker:new api.ODCheckerStringStructure("opendiscord:ticket-message-text",{maxLength:4096,cliDisplayName:"Message Text",cliDisplayDescription:"The raw text of the DM message. Leave empty to only use the embed."})},
            {key:"embed",checker:createTicketEmbedStructure("opendiscord:ticket-message-embed")}
        ],cliDisplayName:"DM Message",cliDisplayDescription:"The DM message is the message that will be sent to the creator of the ticket when he/she creates a ticket."}),cliDisplayName:"DM Message",cliDisplayDescription:"The DM message is the message that will be sent to the creator of the ticket when he/she creates a ticket."})},

        //TICKET MESSAGE
        {key:"ticketMessage",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-message",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-message",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-message-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the ticket message on ticket creation. (Recommended)"})},
            {key:"text",checker:new api.ODCheckerStringStructure("opendiscord:ticket-message-text",{maxLength:4096,cliDisplayName:"Message Text",cliDisplayDescription:"The raw text of the ticket message. Leave empty to only use the embed."})},
            {key:"embed",checker:createTicketEmbedStructure("opendiscord:ticket-message-embed")},
            {key:"ping",checker:createTicketPingStructure("opendiscord:ticket-message-ping")}
        ],cliDisplayName:"Ticket Message",cliDisplayDescription:"The Ticket Message is the message that will be sent in the ticket itself. It contains a few buttons for quick access to actions."}),cliDisplayName:"Ticket Message",cliDisplayDescription:"The Ticket Message is the message that will be sent in the ticket itself. It contains a few buttons for quick access to actions."})},

        //AUTOCLOSE
        {key:"autoclose",checker:new api.ODCheckerObjectStructure("opendiscord:ticket-autoclose",{children:[
            {key:"enableInactiveHours",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autoclose-enable-hours",{cliDisplayName:"Enable Inactive Hours",cliDisplayDescription:"Enable/disable closing the ticket when it has been inactive for the configured amount of time."})},
            {key:"inactiveHours",checker:new api.ODCheckerNumberStructure("opendiscord:ticket-autoclose-hours",{zeroAllowed:false,negativeAllowed:false,floatAllowed:true,min:1,max:8544,cliDisplayName:"Inactive Hours",cliDisplayDescription:"The amount of hours the ticket must be inactive."})},
            {key:"enableUserLeave",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autoclose-enable-leave",{cliDisplayName:"Enable User Leave",cliDisplayDescription:"Instantly close the ticket when the creator of the ticket leaves the server."})},
            {key:"disableOnClaim",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autoclose-disable-claim",{cliDisplayName:"Disable On Claim",cliDisplayDescription:"Disable the autoclose system when the ticket is claimed by any admin."})},
        ],cliDisplayName:"Autoclose",cliDisplayDescription:"Manage the autoclose system for this ticket type/option."})},

        //AUTODELETE
        {key:"autodelete",checker:new api.ODCheckerObjectStructure("opendiscord:ticket-autodelete",{children:[
            {key:"enableInactiveDays",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autodelete-enable-days",{cliDisplayName:"Enable Inactive Days",cliDisplayDescription:"Enable/disable deleting the ticket when it has been inactive for the configured amount of time."})},
            {key:"inactiveDays",checker:new api.ODCheckerNumberStructure("opendiscord:ticket-autodelete-days",{zeroAllowed:false,negativeAllowed:false,floatAllowed:true,min:1,max:356,cliDisplayName:"Inactive Days",cliDisplayDescription:"The amount of days the ticket must be inactive."})},
            {key:"enableUserLeave",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autodelete-enable-leave",{cliDisplayName:"Enable User Leave",cliDisplayDescription:"Instantly delete the ticket when the creator of the ticket leaves the server."})},
            {key:"disableOnClaim",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autodelete-disable-claim",{cliDisplayName:"Disable On Claim",cliDisplayDescription:"Disable the autodelete system when the ticket is claimed by any admin."})},
        ],cliDisplayName:"Autodelete",cliDisplayDescription:"Manage the autodelete system for this ticket type/option."})},

        //COOLDOWN
        {key:"cooldown",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-cooldown",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-cooldown",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-cooldown-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the cooldown of this ticket option."})},
            {key:"cooldownMinutes",checker:new api.ODCheckerNumberStructure("opendiscord:ticket-cooldown-minutes",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,max:512640,cliDisplayName:"Cooldown Minutes",cliDisplayDescription:"The amount of minutes a user needs to wait before creating another ticket of this type/option."})},
        ],cliDisplayName:"Cooldown",cliDisplayDescription:"Manage cooldowns for this ticket type/option."}),cliDisplayName:"Cooldown",cliDisplayDescription:"Manage cooldowns for this ticket type/option."})},

        //LIMITS
        {key:"limits",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-limits",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-limits",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-limits-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the limits of this ticket option. This is not related to the global ticket limits."})},
            {key:"globalMaximum",checker:new api.ODCheckerNumberStructure("opendiscord:ticket-limits-global",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,cliInitDefaultValue:10,cliDisplayName:"Global Maximum",cliDisplayDescription:"The maximum amount of tickets of this type/option that are able to exist in the server at the same time."})},
            {key:"userMaximum",checker:new api.ODCheckerNumberStructure("opendiscord:ticket-limits-user",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,cliInitDefaultValue:3,cliDisplayName:"User Maximum",cliDisplayDescription:"The maximum amount of tickets of this type/option from a specific user that are able to exist in the server at the same time."})}
        ],cliDisplayName:"Option Limits",cliDisplayDescription:"Manage option-based limits for ticket creation to reduce the workload on your support team."}),cliDisplayName:"Limits",cliDisplayDescription:"Manage option-based limits for ticket creation to reduce the workload on your support team."})},

        //SLOW MODE
        {key:"slowMode",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-slowmode",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-limits",{children:[
            {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-slowmode-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable ticket slow mode."})},
            {key:"slowModeSeconds",checker:new api.ODCheckerNumberStructure("opendiscord:ticket-slowmode-seconds",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,cliInitDefaultValue:20,cliDisplayName:"Slow Mode Seconds",cliDisplayDescription:"The amount of seconds users need to wait between sending messages."})},
        ],cliDisplayName:"Option Slow Mode",cliDisplayDescription:"Add slow mode to this ticket option to restrict the amount of message spam users can send."}),cliDisplayName:"Slow Mode",cliDisplayDescription:"Add slow mode to this ticket option to restrict the amount of message spam users can send."})},

    ],cliDisplayName:"Ticket Option",cliDisplayDescription:"Manage all ticket-specific settings of this option/type."})},

    //WEBSITE
    {name:"Website",priority:0,properties:[{key:"type",value:"website"}],checker:new api.ODCheckerObjectStructure("opendiscord:website",{cliDisplayKeyInParentArray:"name",cliDisplayAdditionalKeysInParentArray:["id","type"],children:[
        {key:"id",checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:website-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40,cliDisplayName:"Id",cliDisplayDescription:"The id of this website option. Used in panels."})},
        {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:website-name",{minLength:2,maxLength:45,cliDisplayName:"Name",cliDisplayDescription:"The name of this website option."})},
        {key:"description",checker:new api.ODCheckerStringStructure("opendiscord:website-description",{maxLength:256,cliDisplayName:"Description",cliDisplayDescription:"The description of this website option."})},
        
        //WEBSITE BUTTON
        {key:"button",checker:new api.ODCheckerObjectStructure("opendiscord:ticket-button",{children:[
            {key:"emoji",checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:ticket-button-emoji",0,1,true,{cliDisplayName:"Emoji",cliDisplayDescription:"The emoji of the button. At least 1 of 2 (emoji/label) must be provided."})},
            {key:"label",checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-label",{maxLength:80,cliDisplayName:"Label",cliDisplayDescription:"The label of the button. At least 1 of 2 (emoji/label) must be provided."})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("opendiscord:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        },cliDisplayName:"Button",cliDisplayDescription:"Customise the button layout of this website option."})},

        //WEBSITE URL
        {key:"url",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:website-url",false,{allowHttp:false},{cliDisplayName:"URL",cliDisplayDescription:"The URL this button will link to."})},
    ],cliDisplayName:"Website Option",cliDisplayDescription:"Manage all settings of this website/url option."})},

    //REACTION ROLES
    {name:"Reaction Role",priority:0,properties:[{key:"type",value:"role"}],checker:new api.ODCheckerObjectStructure("opendiscord:role",{cliDisplayKeyInParentArray:"name",cliDisplayAdditionalKeysInParentArray:["id","type"],children:[
        {key:"id",checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:role-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40,cliDisplayName:"Id",cliDisplayDescription:"The id of this role option. Used in panels."})},
        {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:role-name",{minLength:2,maxLength:45,cliDisplayName:"Name",cliDisplayDescription:"The name of this role option."})},
        {key:"description",checker:new api.ODCheckerStringStructure("opendiscord:role-description",{maxLength:256,cliDisplayName:"Description",cliDisplayDescription:"The description of this role option."})},

        //ROLE BUTTON
        {key:"button",checker:new api.ODCheckerObjectStructure("opendiscord:ticket-button",{children:[
            {key:"emoji",checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:ticket-button-emoji",0,1,true,{cliDisplayName:"Emoji",cliDisplayDescription:"The emoji of the button. At least 1 of 2 (emoji/label) must be provided."})},
            {key:"label",checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-label",{maxLength:80,cliDisplayName:"Label",cliDisplayDescription:"The label of the button. At least 1 of 2 (emoji/label) must be provided."})},
            {key:"color",checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-color",{choices:["gray","red","green","blue"],cliDisplayName:"Color",cliDisplayDescription:"The color of the button. Does not apply when using a dropdown panel."})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("opendiscord:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        },cliDisplayName:"Button",cliDisplayDescription:"Customise the button layout of this reaction role option."})},

        //ROLE SETTINGS
        {key:"roles",checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:role-roles","role",[],{allowDoubles:false,minLength:1,cliDisplayPropertyName:"role",cliDisplayName:"Roles",cliDisplayDescription:"A list of roles to add/remove when clicking on the button."},{cliDisplayName:"Role",cliDisplayDescription:"The discord role ID you want to add/remove."})},
        {key:"mode",checker:new api.ODCheckerStringStructure("opendiscord:role-mode",{choices:["add","remove","add&remove"],cliDisplayName:"Mode",cliDisplayDescription:"Decide how the button will work: add-only, remove-only or add & remove."})},
        {key:"removeRolesOnAdd",checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:role-remove-roles","role",[],{allowDoubles:false,cliDisplayPropertyName:"role",cliDisplayName:"Remove Roles On Add",cliDisplayDescription:"An additional list of roles to remove when the roles of this option are added. (Can be used to select between roles)"},{cliDisplayName:"Remove Role",cliDisplayDescription:"The discord role ID you want to remove when other roles are added."})},
        {key:"addOnMemberJoin",checker:new api.ODCheckerBooleanStructure("opendiscord:role-add-on-join",{cliDisplayName:"Add On Member Join",cliDisplayDescription:"Automatically add these roles to a user when joining the server."})},
    ],cliDisplayName:"Reaction Role Option",cliDisplayDescription:"Manage all settings of this reaction role option."})},
],cliDisplayName:"Option",cliDisplayDescription:"Manage an option of one of the 3 types: ticket, website, role."}),cliDisplayName:"Options",cliDisplayDescription:"A list of all options in the bot. Here you can add, modify & remove ticket types, website buttons & reaction roles!"})

export const defaultPanelsStructure = new api.ODCheckerArrayStructure("opendiscord:panels",{allowedTypes:["object"],cliDisplayPropertyName:"panel",propertyChecker:new api.ODCheckerObjectStructure("opendiscord:panels",{cliDisplayKeyInParentArray:"name",cliDisplayAdditionalKeysInParentArray:["id","dropdown"],children:[
    {key:"id",checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:panel-id","openticket","panel-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40,cliDisplayName:"Id",cliDisplayDescription:"The id of this panel. Used in the /panel command."})},
    {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:panel-name",{minLength:3,maxLength:50,cliDisplayName:"Name",cliDisplayDescription:"The name of this panel."})},
    {key:"dropdown",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-dropdown",{cliDisplayName:"Dropdown",cliDisplayDescription:"Decide whether to use buttons or a dropdown in the panel. Dropdowns only support options of the 'ticket' type!"})},
    {key:"options",checker:new api.ODCheckerCustomStructure_UniqueIdArray("opendiscord:panel-options","openticket","option-ids","option-ids-used",{allowDoubles:false,minLength:1,maxLength:25,cliDisplayPropertyName:"option",cliDisplayName:"Options",cliDisplayDescription:"A list of valid option IDs to show in this panel."},{cliDisplayName:"Option ID",cliDisplayDescription:"A valid option ID from the options.json config.",cliAutocompleteFunc:async () => {
        const uncheckedRawData = opendiscord.configs.get("opendiscord:options").data
        if (!Array.isArray(uncheckedRawData)) return null
        const idList = uncheckedRawData.filter((option) => typeof option == "object" && typeof option["id"] == "string").map((option) => option.id)
        return (idList.length > 0) ? idList : null
    }})},
    
    //EMBED & TEXT
    {key:"text",checker:new api.ODCheckerStringStructure("opendiscord:panel-text",{maxLength:4096,cliDisplayName:"Panel Text",cliDisplayDescription:"The raw text of the panel message. Leave empty to use the embed."})},
    {key:"embed",checker:createPanelEmbedStructure("opendiscord:panel-embed")},
    
    //SETTINGS
    {key:"settings",checker:new api.ODCheckerObjectStructure("opendiscord:panel-settings",{cliInitSkipKeys:["dropdownPlaceholder","describeOptionsCustomTitle"],children:[
        {key:"dropdownPlaceholder",checker:new api.ODCheckerStringStructure("opendiscord:panel-settings-placeholder",{maxLength:100,cliInitDefaultValue:"Create a ticket!",cliDisplayName:"Dropdown Placeholder",cliDisplayDescription:"Configure the text displayed in the dropdown when nothing is selected."})},
        {key:"enableMaxTicketsWarningInText",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-maxtickets-text",{cliDisplayName:"Enable Max Tickets Warning (Text)",cliDisplayDescription:"Enable/disable the warning which shows how many tickets you can create in the text contents of the panel."})},
        {key:"enableMaxTicketsWarningInEmbed",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-maxtickets-embed",{cliDisplayName:"Enable Max Tickets Warning (Embed)",cliDisplayDescription:"Enable/disable the warning which shows how many tickets you can create in the embed of the panel."})},
        
        {key:"describeOptionsLayout",checker:new api.ODCheckerStringStructure("opendiscord:panel-settings-describe-layout",{choices:["simple","normal","detailed"],cliDisplayName:"Describe Options Layout",cliDisplayDescription:"The layout to use in the auto-generated option descriptions (simple, normal, detailed)."})},
        {key:"describeOptionsCustomTitle",checker:new api.ODCheckerStringStructure("opendiscord:panel-settings-describe-title",{maxLength:512,cliDisplayName:"Describe Options Title",cliDisplayDescription:"Customise the title to use in the auto-generated option descriptions."})},
        {key:"describeOptionsInText",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-describe-text",{cliDisplayName:"Describe Options In Text",cliDisplayDescription:"Enable/disable showing the auto-generated option descriptions in the raw text contents of the panel."})},
        {key:"describeOptionsInEmbedFields",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-describe-fields",{cliDisplayName:"Describe Options In Embed Fields",cliDisplayDescription:"Enable/disable showing the auto-generated option descriptions in the embed fields of the panel."})},
        {key:"describeOptionsInEmbedDescription",checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-describe-embed",{cliDisplayName:"Describe Options In Embed Description",cliDisplayDescription:"Enable/disable showing the auto-generated option descriptions in the embed description of the panel."})},
    ],cliDisplayName:"Settings",cliDisplayDescription:"Manage additional settings & customisability for this panel."})},
],cliDisplayName:"Panel",cliDisplayDescription:"Manage, customise and configure a panel to your preference."}),cliDisplayName:"Panels",cliDisplayDescription:"A list of all panels in the bot. Here you can add, modify & remove existing panels or customise them to your preference."})

export const defaultQuestionsStructure = new api.ODCheckerArrayStructure("opendiscord:questions",{allowedTypes:["object"],cliDisplayPropertyName:"question",propertyChecker:new api.ODCheckerObjectStructure("opendiscord:questions",{cliDisplayKeyInParentArray:"name",cliDisplayAdditionalKeysInParentArray:["id","type"],children:[
    {key:"id",checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:question-id","openticket","question-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40,cliDisplayName:"Id",cliDisplayDescription:"The id of this question. Used in ticket options."})},
    {key:"name",checker:new api.ODCheckerStringStructure("opendiscord:question-name",{minLength:3,maxLength:45,cliDisplayName:"Name",cliDisplayDescription:"The name of this question."})},
    {key:"type",checker:new api.ODCheckerStringStructure("opendiscord:question-type",{choices:["short","paragraph"],cliDisplayName:"Type",cliDisplayDescription:"The type of this question (short/paragraph)."})},
    
    {key:"required",checker:new api.ODCheckerBooleanStructure("opendiscord:question-required",{cliDisplayName:"Required",cliDisplayDescription:"Is this question required? If not, it can be left empty."})},
    {key:"placeholder",checker:new api.ODCheckerStringStructure("opendiscord:question-placeholder",{maxLength:100,cliDisplayName:"Placeholder",cliDisplayDescription:"The placeholder to show in the field when nothing has been written yet."})},
    
    {key:"length",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:question-length",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:question-length",{children:[
        {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:question-length-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable length validation for this question."})},
        {key:"min",checker:new api.ODCheckerNumberStructure("opendiscord:question-length-min",{min:0,max:1024,negativeAllowed:false,floatAllowed:false,cliDisplayName:"Min Length",cliDisplayDescription:"The minimum amount of characters required."})},
        {key:"max",checker:new api.ODCheckerNumberStructure("opendiscord:question-length-max",{min:1,max:1024,negativeAllowed:false,floatAllowed:false,cliInitDefaultValue:100,cliDisplayName:"Max Length",cliDisplayDescription:"The maximum amount of characters allowed."})},
    ],cliDisplayName:"Length Validation",cliDisplayDescription:"Add length validation to the question. This way, the contents must be at least/most ... characters."}),cliDisplayName:"Length Validation",cliDisplayDescription:"Add length validation to the question. This way, the contents must be at least/most ... characters."})},
],cliDisplayName:"Question",cliDisplayDescription:"Manage, customise and configure a question to your preference."}),cliDisplayName:"Questions",cliDisplayDescription:"A list of all questions in the bot. Here you can add, modify & remove existing questions or customise them to your preference."})

export const defaultTranscriptsStructure = new api.ODCheckerObjectStructure("opendiscord:transcripts",{children:[
    //GENERAL
    {key:"general",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-general",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-general",{children:[
        {key:"enabled",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable the transcript system."})},
        
        {key:"enableChannel",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-channel",{cliDisplayName:"Enable Channel",cliDisplayDescription:"Send the transcript to a specific channel in your server (configurable in 'channel' property)."})},
        {key:"enableCreatorDM",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-creator-dm",{cliDisplayName:"Enable Creator DM",cliDisplayDescription:"Send the transcript in DM to the creator of the ticket."})},
        {key:"enableParticipantDM",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-participant-dm",{cliDisplayName:"Enable Participant DM",cliDisplayDescription:"Send the transcript in DM to all non-admin participants of the ticket."})},
        {key:"enableActiveAdminDM",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-active-admin-dm",{cliDisplayName:"Enable Active Admin DM",cliDisplayDescription:"Send the transcript in DM to all admins that actively wrote in the ticket."})},
        {key:"enableEveryAdminDM",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-every-admin-dm",{cliDisplayName:"Enable Every Admin DM",cliDisplayDescription:"Send the transcript in DM to all admins assigned to the ticket."})},

        {key:"channel",checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:transcripts-channel","channel",true,[],{cliDisplayName:"Channel",cliDisplayDescription:"The discord channel ID to send the transcript to."})},
        {key:"mode",checker:new api.ODCheckerStringStructure("opendiscord:transcripts-mode",{choices:["html","text"],cliDisplayName:"Transcript Mode",cliDisplayDescription:"The transcript type to use: 'text' or 'html'."})},
    ],cliDisplayName:"General",cliDisplayDescription:"General settings for the transcripts."}),cliDisplayName:"General",cliDisplayDescription:"General settings for the transcripts."})},

    //EMBED SETTINGS
    {key:"embedSettings",checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-embed-settings",{children:[
        {key:"customColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-embed-color",false,true,{cliDisplayName:"Custom Color",cliDisplayDescription:"Use a custom color in the embed. When empty, the default bot color will be used."})},
        {key:"listAllParticipants",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-embed-list-participants",{cliDisplayName:"List Participants",cliDisplayDescription:"List all participants of the ticket in the embed."})},
        {key:"includeTicketStats",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-embed-include-ticket-stats",{cliDisplayName:"Include Ticket Stats",cliDisplayDescription:"Include some stats from the ticket in the embed."})},
    ],cliDisplayName:"Embed Settings",cliDisplayDescription:"Settings and customisability related to the embed which contains the transcript."})},

    //TEXT STYLE
    {key:"textTranscriptStyle",checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-text",{children:[
        {key:"layout",checker:new api.ODCheckerStringStructure("opendiscord:transcripts-text-layout",{choices:["simple","normal","detailed"],cliDisplayName:"Layout",cliDisplayDescription:"The layout to use in the text-transcripts (simple, normal, detailed)."})},
        {key:"includeStats",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-stats",{cliDisplayName:"Include Stats",cliDisplayDescription:"Include statistics in the transcript?"})},
        {key:"includeIds",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-ids",{cliDisplayName:"Include Ids",cliDisplayDescription:"Include role, channel & user ID's in the transcript?"})},
        {key:"includeEmbeds",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-embeds",{cliDisplayName:"Include Embeds",cliDisplayDescription:"Include message embeds in the transcript?"})},
        {key:"includeFiles",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-files",{cliDisplayName:"Include Files",cliDisplayDescription:"Include files & attachments in the transcript?"})},
        {key:"includeBotMessages",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-bots",{cliDisplayName:"Include Bots",cliDisplayDescription:"Include messages sent by bots/apps?"})},

        {key:"fileMode",checker:new api.ODCheckerStringStructure("opendiscord:transcripts-text-file-mode",{choices:["custom","channel-name","channel-id","user-name","user-id"],cliDisplayName:"File Mode",cliDisplayDescription:"Select the mode the transcript will be named: custom, channel-name, user-name, user-id."})},
        {key:"customFileName",checker:new api.ODCheckerStringStructure("opendiscord:transcripts-file-name",{maxLength:512,regex:/^[^\.#%&{}\\<>*?/!'":@`|=]*$/,cliDisplayName:"Custom File Name",cliDisplayDescription:"Use this as transcript name when the mode is set to 'custom'."})},
    ],cliDisplayName:"Text Transcript Style",cliDisplayDescription:"Configure the 'Text Transcripts' from Open Ticket."})},

    //HTML STYLE
    {key:"htmlTranscriptStyle",checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html",{children:[
        //HTML BACKGROUND
        {key:"background",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-background",{property:"enableCustomBackground",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-background",{children:[
            {key:"enableCustomBackground",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-html-background-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable background customisation in the HTML Transcripts."})},
            {key:"backgroundColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-background-color",false,true,{cliDisplayName:"Background Color",cliDisplayDescription:"The hex-color of the background."})},
            {key:"backgroundImage",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:transcripts-html-background-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]},{cliDisplayName:"Background Image",cliDisplayDescription:"A URL to an image to use in the background. This will overwrite the background color."})},
        ],cliDisplayName:"Background Style",cliDisplayDescription:"Customise the background of the HTML Transcripts."}),cliDisplayName:"Background Style",cliDisplayDescription:"Customise the background of the HTML Transcripts."})},

        //HTML HEADER
        {key:"header",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-header",{property:"enableCustomHeader",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-header",{children:[
            {key:"enableCustomHeader",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-html-header-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable header customisation in the HTML Transcripts."})},
            {key:"backgroundColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-header-bgcolor",false,false,{cliDisplayName:"Background Color",cliDisplayDescription:"The hex-color of the header background."})},
            {key:"decoColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-header-decocolor",false,false,{cliDisplayName:"Decoration Color",cliDisplayDescription:"The hex-color of the header decoration (e.g. horizontal line)."})},
            {key:"textColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-header-textcolor",false,false,{cliDisplayName:"Text Color",cliDisplayDescription:"The hex-color of the header text."})},
        ],cliDisplayName:"Header Style",cliDisplayDescription:"Customise the header of the HTML Transcripts."}),cliDisplayName:"Header Style",cliDisplayDescription:"Customise the header of the HTML Transcripts."})},

        //HTML STATS
        {key:"stats",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-stats",{property:"enableCustomStats",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-stats",{children:[
            {key:"enableCustomStats",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-html-stats-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable stats customisation in the HTML Transcripts."})},
            {key:"backgroundColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-bgcolor",false,false,{cliDisplayName:"Background Color",cliDisplayDescription:"The hex-color of the stats background."})},
            {key:"keyTextColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-keycolor",false,false,{cliDisplayName:"Key Text Color",cliDisplayDescription:"The hex-color of the stats key text."})},
            {key:"valueTextColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-valuecolor",false,false,{cliDisplayName:"Value Text Color",cliDisplayDescription:"The hex-color of the stats value text."})},
            {key:"hideBackgroundColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-hidebgcolor",false,false,{cliDisplayName:"Hide Background Color",cliDisplayDescription:"The hex-color of the stats hide button background."})},
            {key:"hideTextColor",checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-hidecolor",false,false,{cliDisplayName:"Hide Text Color",cliDisplayDescription:"The hex-color of the stats hide button text."})},
        ],cliDisplayName:"Stats Style",cliDisplayDescription:"Customise the stats of the HTML Transcripts."}),cliDisplayName:"Stats Style",cliDisplayDescription:"Customise the stats of the HTML Transcripts."})},

        //HTML FAVICON
        {key:"favicon",checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-favicon",{property:"enableCustomFavicon",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-favicon",{children:[
            {key:"enableCustomFavicon",checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-html-favicon-enabled",{cliDisplayName:"Enabled",cliDisplayDescription:"Enable/disable favicon customisation in the HTML Transcripts."})},
            {key:"imageUrl",checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:transcripts-html-favicon-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp"]},{cliDisplayName:"LOREMIPSUM",cliDisplayDescription:"IPSUMLOREM"})},
        ],cliDisplayName:"Favicon Style",cliDisplayDescription:"Customise the favicon of the HTML Transcripts."}),cliDisplayName:"Favicon Style",cliDisplayDescription:"Customise the favicon of the HTML Transcripts."})},
    ],cliDisplayName:"Html Transcript Style",cliDisplayDescription:"Configure the 'Html Transcripts' from Open Ticket."})},
],cliDisplayName:"Transcripts",cliDisplayDescription:"All settings related to transcripts."})

export const defaultUnusedOptionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {
    const optionList: string[] = manager.storage.get("openticket","option-ids")
    const usedOptionList: string[] = manager.storage.get("openticket","option-ids-used")
    if (!optionList || ! usedOptionList) return {valid:true,messages:[]}

    const optionChecker = manager.get("opendiscord:options")
    if (!optionChecker) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    optionList.forEach((id) => {
        if (!usedOptionList.includes(id)){
            //id isn't used anywhere => create warning
            final.push(functions.createMessage("opendiscord:options","opendiscord:unused-option",optionChecker.config.file,"warning",`The option "${id}" isn't used anywhere!`,[],null,[`"${id}"`],new api.ODId("opendiscord:unused-options"),null))
        }
    })

    return {valid:true,messages:final}
}

export const defaultUnusedQuestionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {
    const questionList: string[] = manager.storage.get("openticket","question-ids")
    const usedQuestionList: string[] = manager.storage.get("openticket","question-ids-used")
    if (!questionList || ! usedQuestionList) return {valid:true,messages:[]}

    const questionChecker = manager.get("opendiscord:questions")
    if (!questionChecker) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    questionList.forEach((id) => {
        if (!usedQuestionList.includes(id)){
            //id isn't used anywhere => create warning
            final.push(functions.createMessage("opendiscord:questions","opendiscord:unused-question",questionChecker.config.file,"warning",`The question "${id}" isn't used anywhere!`,[],null,[`"${id}"`],new api.ODId("opendiscord:unused-questions"),null))
        }
    })

    return {valid:true,messages:final}
}

export const defaultDropdownOptionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {

    const panelList: string[] = manager.storage.get("openticket","panel-ids")
    if (!panelList) return {valid:true,messages:[]}

    const panelConfig = opendiscord.configs.get("opendiscord:panels")
    if (!panelConfig) return {valid:true,messages:[]}
    
    const optionConfig = opendiscord.configs.get("opendiscord:options")
    if (!optionConfig) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    panelList.forEach((id,index) => {
        const panel = panelConfig.data.find((panel) => panel.id == id)
        if (!panel || !panel.dropdown) return false
        if (panel.options.some((optId) => {
            const option = optionConfig.data.find((option) => option.id == optId)
            if (!option) return false
            if (option.type != "ticket") return true
            else return false
        })){
            //give error when non-ticket options exist in dropdown panel!
            final.push(functions.createMessage("opendiscord:panels","opendiscord:dropdown-option",panelConfig.file,"error","A panel with dropdown enabled can only contain options of the 'ticket' type!",[index,"options"],null,[],new api.ODId("opendiscord:dropdown-options"),null))
        }
    })

    return {valid:(final.length < 1),messages:final}
}
