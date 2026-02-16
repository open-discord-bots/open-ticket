///////////////////////////////////////
//DEFAULT SESSION MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODSessionManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODSessionManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSessionManagerIds_Default {
    //"test-session":ODSession
}

/**## ODSessionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODSessionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.sessions`!
 */
export class ODSessionManager_Default extends api.ODSessionManager {
    get<SessionId extends keyof ODSessionManagerIds_Default>(id:SessionId): ODSessionManagerIds_Default[SessionId]
    get(id:api.ODValidId): api.ODSession|null
    
    get(id:api.ODValidId): api.ODSession|null {
        return super.get(id)
    }

    remove<SessionId extends keyof ODSessionManagerIds_Default>(id:SessionId): ODSessionManagerIds_Default[SessionId]
    remove(id:api.ODValidId): api.ODSession|null
    
    remove(id:api.ODValidId): api.ODSession|null {
        return super.remove(id)
    }

    exists(id:keyof ODSessionManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}