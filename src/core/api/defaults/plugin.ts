///////////////////////////////////////
//DEFAULT POST MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODPluginManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODPluginManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPluginManagerIds_Default {}

/**## ODPluginManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODPluginManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.plugins`!
 */
export class ODPluginManager_Default extends api.ODPluginManager {
    declare classes: ODPluginClassManager_Default

    get<PluginId extends keyof ODPluginManagerIds_Default>(id:PluginId): ODPluginManagerIds_Default[PluginId]
    get(id:api.ODValidId): api.ODPlugin|null
    
    get(id:api.ODValidId): api.ODPlugin|null {
        return super.get(id)
    }

    remove<PluginId extends keyof ODPluginManagerIds_Default>(id:PluginId): ODPluginManagerIds_Default[PluginId]
    remove(id:api.ODValidId): api.ODPlugin|null
    
    remove(id:api.ODValidId): api.ODPlugin|null {
        return super.remove(id)
    }

    exists(id:keyof ODPluginManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODPluginClassManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODPluginClassManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPluginClassManagerIds_Default {}

/**## ODPluginClassManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODPluginClassManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.plugins.classes`!
 */
export class ODPluginClassManager_Default extends api.ODPluginClassManager {
    get<PluginClassId extends keyof ODPluginClassManagerIds_Default>(id:PluginClassId): ODPluginClassManagerIds_Default[PluginClassId]
    get(id:api.ODValidId): api.ODManagerData|null
    
    get(id:api.ODValidId): api.ODManagerData|null {
        return super.get(id)
    }

    remove<PluginClassId extends keyof ODPluginClassManagerIds_Default>(id:PluginClassId): ODPluginClassManagerIds_Default[PluginClassId]
    remove(id:api.ODValidId): api.ODManagerData|null
    
    remove(id:api.ODValidId): api.ODManagerData|null {
        return super.remove(id)
    }

    exists(id:keyof ODPluginClassManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}