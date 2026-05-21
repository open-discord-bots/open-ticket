///////////////////////////////////////
//BASE MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODVersionManagerIdMappings `interface`
 * A list of all available IDs in the default `ODVersionManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODVersionManagerIdMappings extends api.ODVersionManagerIdConstraint {
    "opendiscord:version":api.ODVersion,
    "opendiscord:last-version":api.ODVersion,
    "opendiscord:api":api.ODVersion,
    "opendiscord:transcripts":api.ODVersion,
    "opendiscord:livestatus":api.ODVersion
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedVersionManager `class
 * A special class with types for the Open Ticket `ODVersionManager` class.
 */
export class ODMappedVersionManager extends api.ODVersionManager<ODVersionManagerIdMappings> {}