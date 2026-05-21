///////////////////////////////////////
//OPEN TICKET CONSOLE MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODLiveStatusManagerIdMappings `interface`
 * A list of all available IDs in the default `ODLiveStatusManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODLiveStatusManagerIdMappings extends api.ODLiveStatusManagerIdConstraint {
    "opendiscord:default-djdj-dev":api.ODLiveStatusUrlSource
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedLiveStatusManager `class
 * A special class with types for the Open Ticket `ODLiveStatusManager` class.
 */
export class ODMappedLiveStatusManager extends api.ODLiveStatusManager<ODLiveStatusManagerIdMappings> {}