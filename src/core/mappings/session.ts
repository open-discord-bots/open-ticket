///////////////////////////////////////
//OPEN TICKET SESSION MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODSessionManagerIdMappings `interface`
 * A list of all available IDs in the default `ODSessionManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSessionManagerIdMappings extends api.ODSessionManagerIdConstraint {
    //"opendiscord:example-session":api.ODSession
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedSessionManager `class
 * A special class with types for the Open Ticket `ODSessionManager` class.
 */
export class ODMappedSessionManager extends api.ODSessionManager<ODSessionManagerIdMappings> {}