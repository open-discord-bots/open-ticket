///////////////////////////////////////
//OPEN TICKET PROCESS MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODFlagManagerIdMappings `interface`
 * A list of all available IDs in the default `ODFlagManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFlagManagerIdMappings extends api.ODFlagManagerIdConstraint {
    "opendiscord:no-migration":api.ODFlag,
    "opendiscord:dev-config":api.ODFlag,
    "opendiscord:dev-database":api.ODFlag,
    "opendiscord:debug":api.ODFlag,
    "opendiscord:crash":api.ODFlag,
    "opendiscord:no-transcripts":api.ODFlag,
    "opendiscord:no-checker":api.ODFlag,
    "opendiscord:checker":api.ODFlag,
    "opendiscord:no-easter":api.ODFlag,
    "opendiscord:no-plugins":api.ODFlag,
    "opendiscord:soft-plugins":api.ODFlag,
    "opendiscord:force-slash-update":api.ODFlag,
    "opendiscord:no-compile":api.ODFlag,
    "opendiscord:compile-only":api.ODFlag,
    "opendiscord:silent":api.ODFlag,
    "opendiscord:cli":api.ODFlag,
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedFlagManager `class
 * A special class with types for the Open Ticket `ODFlagManager` class.
 */
export class ODMappedFlagManager extends api.ODFlagManager<ODFlagManagerIdMappings> {}