import {opendiscord, api, utilities} from "../../index"

/** (CONTRIBUTOR GUIDE) HOW TO ADD NEW LANGUAGES?
 * - Add the file to (./languages/) and make sure the metadata is valid.
 * - Register the language in loadAllLanguages() in (./src/data/framework/languageLoader.ts).
 * - Add autocomplete for the language in ODLanguageManagerIds_Default in (./src/core/api/defaults/language.ts).
 * - Update the language list in the README.md translator list.
 * - Update the 2 language counters in the README.md features list.
 * - Update the Open Ticket Documentation.
 */

export const loadAllLanguages = async () => {
    //register languages
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:custom","custom.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:english","english.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:dutch","dutch.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:portuguese","portuguese.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:czech","czech.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:german","german.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:catalan","catalan.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:hungarian","hungarian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:spanish","spanish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:romanian","romanian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:ukrainian","ukrainian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:indonesian","indonesian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:italian","italian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:estonian","estonian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:finnish","finnish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:danish","danish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:thai","thai.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:turkish","turkish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:french","french.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:arabic","arabic.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:hindi","hindi.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:lithuanian","lithuanian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:polish","polish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:latvian","latvian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:norwegian","norwegian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:russian","russian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:swedish","swedish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:vietnamese","vietnamese.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:persian","persian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:bengali","bengali.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:greek","greek.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:japanese","japanese.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:korean","korean.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:kurdish","kurdish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:simplified-chinese","simplified-chinese.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:slovenian","slovenian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:tamil","tamil.json"))
}