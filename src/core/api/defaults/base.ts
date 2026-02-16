///////////////////////////////////////
//BASE MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODVersionManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODVersionManager` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODVersionManagerIds_Default {
    "opendiscord:version":api.ODVersion,
    "opendiscord:last-version":api.ODVersion,
    "opendiscord:api":api.ODVersion,
    "opendiscord:transcripts":api.ODVersion,
    "opendiscord:livestatus":api.ODVersion
}

/**## ODFlagManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFlagManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.flags`!
 */
export class ODVersionManager_Default extends api.ODVersionManager {
    get<VersionId extends keyof ODVersionManagerIds_Default>(id:VersionId): ODVersionManagerIds_Default[VersionId]
    get(id:api.ODValidId): api.ODVersion|null
    
    get(id:api.ODValidId): api.ODVersion|null {
        return super.get(id)
    }

    remove<VersionId extends keyof ODVersionManagerIds_Default>(id:VersionId): ODVersionManagerIds_Default[VersionId]
    remove(id:api.ODValidId): api.ODVersion|null
    
    remove(id:api.ODValidId): api.ODVersion|null {
        return super.remove(id)
    }

    exists(id:keyof ODVersionManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}