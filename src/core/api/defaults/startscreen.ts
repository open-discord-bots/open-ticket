///////////////////////////////////////
//DEFAULT STARTSCREEN MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODStartScreenManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODStartScreenManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStartScreenManagerIds_Default {
    "opendiscord:logo":api.ODStartScreenLogoComponent,
    "opendiscord:header":api.ODStartScreenHeaderComponent,
    "opendiscord:flags":api.ODStartScreenFlagsCategoryComponent,
    "opendiscord:plugins":api.ODStartScreenPluginsCategoryComponent,
    "opendiscord:stats":api.ODStartScreenPropertiesCategoryComponent,
    "opendiscord:livestatus":api.ODStartScreenLiveStatusCategoryComponent,
    "opendiscord:logs":api.ODStartScreenCategoryComponent
}

/**## ODStartScreenManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODStartScreenManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.startscreen`!
 */
export class ODStartScreenManager_Default extends api.ODStartScreenManager {
    get<StartScreenId extends keyof ODStartScreenManagerIds_Default>(id:StartScreenId): ODStartScreenManagerIds_Default[StartScreenId]
    get(id:api.ODValidId): api.ODStartScreenComponent|null
    
    get(id:api.ODValidId): api.ODStartScreenComponent|null {
        return super.get(id)
    }

    remove<StartScreenId extends keyof ODStartScreenManagerIds_Default>(id:StartScreenId): ODStartScreenManagerIds_Default[StartScreenId]
    remove(id:api.ODValidId): api.ODStartScreenComponent|null
    
    remove(id:api.ODValidId): api.ODStartScreenComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODStartScreenManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}