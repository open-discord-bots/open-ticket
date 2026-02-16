///////////////////////////////////////
//DEFAULT CONSOLE MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODLiveStatusManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODLiveStatusManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODLiveStatusManagerIds_Default {
    "opendiscord:default-djdj-dev":api.ODLiveStatusUrlSource
}

/**## ODLiveStatusManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODLiveStatusManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.livestatus`!
 */
export class ODLiveStatusManager_Default extends api.ODLiveStatusManager {
    get<LiveStatusId extends keyof ODLiveStatusManagerIds_Default>(id:LiveStatusId): ODLiveStatusManagerIds_Default[LiveStatusId]
    get(id:api.ODValidId): api.ODLiveStatusSource|null
    
    get(id:api.ODValidId): api.ODLiveStatusSource|null {
        return super.get(id)
    }

    remove<LiveStatusId extends keyof ODLiveStatusManagerIds_Default>(id:LiveStatusId): ODLiveStatusManagerIds_Default[LiveStatusId]
    remove(id:api.ODValidId): api.ODLiveStatusSource|null
    
    remove(id:api.ODValidId): api.ODLiveStatusSource|null {
        return super.remove(id)
    }

    exists(id:keyof ODLiveStatusManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}