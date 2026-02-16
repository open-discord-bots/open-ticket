///////////////////////////////////////
//DEFAULT CODE MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODCodeManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCodeManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCodeManagerIds_Default {
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

/**## ODCodeManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCodeManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.code`!
 */
export class ODCodeManager_Default extends api.ODCodeManager {
    get<CodeId extends keyof ODCodeManagerIds_Default>(id:CodeId): ODCodeManagerIds_Default[CodeId]
    get(id:api.ODValidId): api.ODCode|null
    
    get(id:api.ODValidId): api.ODCode|null {
        return super.get(id)
    }

    remove<CodeId extends keyof ODCodeManagerIds_Default>(id:CodeId): ODCodeManagerIds_Default[CodeId]
    remove(id:api.ODValidId): api.ODCode|null
    
    remove(id:api.ODValidId): api.ODCode|null {
        return super.remove(id)
    }

    exists(id:keyof ODCodeManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}