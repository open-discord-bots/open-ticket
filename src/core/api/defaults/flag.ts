///////////////////////////////////////
//DEFAULT PROCESS MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODFlagManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODFlagManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFlagManagerIds_Default {
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

/**## ODFlagManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFlagManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.flags`!
 */
export class ODFlagManager_Default extends api.ODFlagManager {
    get<FlagId extends keyof ODFlagManagerIds_Default>(id:FlagId): ODFlagManagerIds_Default[FlagId]
    get(id:api.ODValidId): api.ODFlag|null
    
    get(id:api.ODValidId): api.ODFlag|null {
        return super.get(id)
    }

    remove<FlagId extends keyof ODFlagManagerIds_Default>(id:FlagId): ODFlagManagerIds_Default[FlagId]
    remove(id:api.ODValidId): api.ODFlag|null
    
    remove(id:api.ODValidId): api.ODFlag|null {
        return super.remove(id)
    }

    exists(id:keyof ODFlagManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}