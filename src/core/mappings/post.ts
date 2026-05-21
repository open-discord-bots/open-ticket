///////////////////////////////////////
//OPEN TICKET POST MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"

/**## ODPostManagerIdMappings `interface`
 * A list of all available IDs in the default `ODPostManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPostManagerIdMappings extends api.ODPostManagerIdConstraint {
    "opendiscord:logs":api.ODPost<discord.GuildTextBasedChannel>|null,
    "opendiscord:transcripts":api.ODPost<discord.GuildTextBasedChannel>|null
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedPostManager `class
 * A special class with types for the Open Ticket `ODPostManager` class.
 */
export class ODMappedPostManager extends api.ODPostManager<ODPostManagerIdMappings> {}