///////////////////////////////////////
//OPEN TICKET COOLDOWN MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODCooldownManagerIdMappings `interface`
 * A list of all available IDs in the default `ODCooldownManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCooldownManagerIdMappings extends api.ODCooldownManagerIdConstraint {
    //"opendiscord:cooldown":api.ODCooldown
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedCooldownManager `class
 * A special class with types for the Open Ticket `ODCooldownManager` class.
 */
export class ODMappedCooldownManager extends api.ODCooldownManager<ODCooldownManagerIdMappings> {}