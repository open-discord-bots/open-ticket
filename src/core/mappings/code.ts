///////////////////////////////////////
//OPEN TICKET CODE MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODCodeManagerIdMappings `interface`
 * A list of all available IDs in the default `ODCodeManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCodeManagerIdMappings extends api.ODCodeManagerIdConstraint {
    "opendiscord:command-error-handling":api.ODCode,
    "opendiscord:start-listening-interactions":api.ODCode,
    "opendiscord:panel-database-cleaner":api.ODCode,
    "opendiscord:suffix-database-cleaner":api.ODCode,
    "opendiscord:option-database-cleaner":api.ODCode,
    "opendiscord:user-database-cleaner":api.ODCode,
    "opendiscord:ticket-database-cleaner":api.ODCode,
    "opendiscord:panel-auto-update":api.ODCode,
    "opendiscord:ticket-saver":api.ODCode,
    "opendiscord:blacklist-saver":api.ODCode,
    "opendiscord:auto-role-on-join":api.ODCode,
    "opendiscord:autoclose-timeout":api.ODCode,
    "opendiscord:autoclose-leave":api.ODCode,
    "opendiscord:autodelete-timeout":api.ODCode,
    "opendiscord:autodelete-leave":api.ODCode,
    "opendiscord:ticket-anti-busy":api.ODCode,
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedCodeManager `class
 * A special class with types for the Open Ticket `ODCodeManager` class.
 */
export class ODMappedCodeManager extends api.ODCodeManager<ODCodeManagerIdMappings> {}