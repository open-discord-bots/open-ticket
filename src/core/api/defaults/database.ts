///////////////////////////////////////
//DEFAULT DATABASE MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODTicketJson } from "../openticket/ticket"
import { ODOptionJson } from "../openticket/option"

/**## ODDatabaseManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDatabaseManagerIds_Default {
    "opendiscord:global":ODFormattedJsonDatabase_DefaultGlobal,
    "opendiscord:stats":api.ODFormattedJsonDatabase,
    "opendiscord:tickets":ODFormattedJsonDatabase_DefaultTickets,
    "opendiscord:users":ODFormattedJsonDatabase_DefaultUsers,
    "opendiscord:options":ODFormattedJsonDatabase_DefaultOptions,
}

/**## ODDatabaseManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDatabaseManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.databases`!
 */
export class ODDatabaseManager_Default extends api.ODDatabaseManager {
    get<DatabaseId extends keyof ODDatabaseManagerIds_Default>(id:DatabaseId): ODDatabaseManagerIds_Default[DatabaseId]
    get(id:api.ODValidId): api.ODDatabase|null

    get(id:api.ODValidId): api.ODDatabase|null {
        return super.get(id)
    }

    remove<DatabaseId extends keyof ODDatabaseManagerIds_Default>(id:DatabaseId): ODDatabaseManagerIds_Default[DatabaseId]
    remove(id:api.ODValidId): api.ODDatabase|null

    remove(id:api.ODValidId): api.ODDatabase|null {
        return super.remove(id)
    }

    exists(id:keyof ODDatabaseManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean

    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODFormattedJsonDatabaseIds_DefaultGlobal `type`
 * This interface is a list of ids available in the `ODFormattedJsonDatabase_DefaultGlobal` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultGlobal {
    "opendiscord:panel-message":string,
    "opendiscord:panel-update":string,
    "opendiscord:option-suffix-counter":number,
    "opendiscord:option-suffix-history":string[],
    "opendiscord:last-version":string
}

/**## ODFormattedJsonDatabase_DefaultGlobal `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `global.json` database!
 */
export class ODFormattedJsonDatabase_DefaultGlobal extends api.ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultGlobal[CategoryId]): api.ODOptionalPromise<boolean>
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean>
    
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean> {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId, key:string): api.ODOptionalPromise<ODFormattedJsonDatabaseIds_DefaultGlobal[CategoryId]|undefined>
    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined>

    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined> {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId, key:string): api.ODOptionalPromise<boolean>
    delete(category:string, key:string): api.ODOptionalPromise<boolean>

    delete(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultGlobal, key:string): api.ODOptionalPromise<boolean>
    exists(category:string, key:string): api.ODOptionalPromise<boolean>

    exists(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId): api.ODOptionalPromise<{key:string, value:ODFormattedJsonDatabaseIds_DefaultGlobal[CategoryId]}[]|undefined>
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined>
    
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined> {
        return super.getCategory(category)
    }
}

/**## ODFormattedJsonDatabaseIds_DefaultTickets `type`
 * This interface is a list of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultTickets {
    "opendiscord:ticket":ODTicketJson
}

/**## ODFormattedJsonDatabase_DefaultTickets `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `tickets.json` database!
 */
export class ODFormattedJsonDatabase_DefaultTickets extends api.ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultTickets[CategoryId]): api.ODOptionalPromise<boolean>
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean>
    
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean> {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId, key:string): api.ODOptionalPromise<ODFormattedJsonDatabaseIds_DefaultTickets[CategoryId]|undefined>
    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined>

    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined> {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId, key:string): api.ODOptionalPromise<boolean>
    delete(category:string, key:string): api.ODOptionalPromise<boolean>

    delete(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultTickets, key:string): api.ODOptionalPromise<boolean>
    exists(category:string, key:string): api.ODOptionalPromise<boolean>

    exists(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId): api.ODOptionalPromise<{key:string, value:ODFormattedJsonDatabaseIds_DefaultTickets[CategoryId]}[]|undefined>
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined>
    
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined> {
        return super.getCategory(category)
    }
}

/**## ODFormattedJsonDatabaseIds_DefaultUsers `type`
 * This interface is a list of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultUsers {
    "opendiscord:blacklist":ODTicketJson
}

/**## ODFormattedJsonDatabase_DefaultUsers `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `users.json` database!
 */
export class ODFormattedJsonDatabase_DefaultUsers extends api.ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultUsers[CategoryId]): api.ODOptionalPromise<boolean>
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean>
    
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean> {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId, key:string): api.ODOptionalPromise<ODFormattedJsonDatabaseIds_DefaultUsers[CategoryId]|undefined>
    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined>

    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined> {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId, key:string): api.ODOptionalPromise<boolean>
    delete(category:string, key:string): api.ODOptionalPromise<boolean>

    delete(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultUsers, key:string): api.ODOptionalPromise<boolean>
    exists(category:string, key:string): api.ODOptionalPromise<boolean>

    exists(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId): api.ODOptionalPromise<{key:string, value:ODFormattedJsonDatabaseIds_DefaultUsers[CategoryId]}[]|undefined>
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined>
    
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined> {
        return super.getCategory(category)
    }
}


/**## ODFormattedJsonDatabaseIds_DefaultOptions `type`
 * This interface is a list of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultOptions {
    "opendiscord:used-option":ODOptionJson
}

/**## ODFormattedJsonDatabase_DefaultOptions `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `options.json` database!
 */
export class ODFormattedJsonDatabase_DefaultOptions extends api.ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultOptions[CategoryId]): api.ODOptionalPromise<boolean>
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean>
    
    set(category:string, key:string, value:api.ODValidJsonType): api.ODOptionalPromise<boolean> {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId, key:string): api.ODOptionalPromise<ODFormattedJsonDatabaseIds_DefaultOptions[CategoryId]|undefined>
    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined>

    get(category:string, key:string): api.ODOptionalPromise<api.ODValidJsonType|undefined> {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId, key:string): api.ODOptionalPromise<boolean>
    delete(category:string, key:string): api.ODOptionalPromise<boolean>

    delete(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultOptions, key:string): api.ODOptionalPromise<boolean>
    exists(category:string, key:string): api.ODOptionalPromise<boolean>

    exists(category:string, key:string): api.ODOptionalPromise<boolean> {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId): api.ODOptionalPromise<{key:string, value:ODFormattedJsonDatabaseIds_DefaultOptions[CategoryId]}[]|undefined>
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined>
    
    getCategory(category:string): api.ODOptionalPromise<{key:string, value:api.ODValidJsonType}[]|undefined> {
        return super.getCategory(category)
    }
}