///////////////////////////////////////
//DEFAULT COOLDOWN MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODCooldownManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCooldownManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCooldownManagerIds_Default {
    
}

/**## ODCooldownManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCooldownManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.cooldowns`!
 */
export class ODCooldownManager_Default extends api.ODCooldownManager {
    get<CooldownId extends keyof ODCooldownManagerIds_Default>(id:CooldownId): ODCooldownManagerIds_Default[CooldownId]
    get(id:api.ODValidId): api.ODCooldown<object>|null
    
    get(id:api.ODValidId): api.ODCooldown<object>|null {
        return super.get(id)
    }

    remove<CooldownId extends keyof ODCooldownManagerIds_Default>(id:CooldownId): ODCooldownManagerIds_Default[CooldownId]
    remove(id:api.ODValidId): api.ODCooldown<object>|null
    
    remove(id:api.ODValidId): api.ODCooldown<object>|null {
        return super.remove(id)
    }

    exists(id:keyof ODCooldownManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}