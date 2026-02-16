///////////////////////////////////////
//DEFAULT SESSION MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODStatsManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODStatsManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatsManagerIds_Default {
    "opendiscord:global":ODStatGlobalScope_DefaultGlobal,
    "opendiscord:system":ODStatGlobalScope_DefaultSystem,
    "opendiscord:user":ODStatScope_DefaultUser,
    "opendiscord:ticket":ODStatScope_DefaultTicket,
    "opendiscord:participants":ODStatScope_DefaultParticipants,
    "opendiscord:messages":ODStatScope_DefaultMessages,
}

/**## ODStatsManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.stats`!
 */
export class ODStatsManager_Default extends api.ODStatsManager {
    get<StatsId extends keyof ODStatsManagerIds_Default>(id:StatsId): ODStatsManagerIds_Default[StatsId]
    get(id:api.ODValidId): api.ODStatScope|null
    
    get(id:api.ODValidId): api.ODStatScope|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatsManagerIds_Default>(id:StatsId): ODStatsManagerIds_Default[StatsId]
    remove(id:api.ODValidId): api.ODStatScope|null
    
    remove(id:api.ODValidId): api.ODStatScope|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatsManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODStatGlobalScopeIds_DefaultGlobal `type`
 * This interface is a list of ids available in the `ODStatGlobalScope_DefaultGlobal` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatGlobalScopeIds_DefaultGlobal {
    "opendiscord:tickets-created":api.ODBasicStat,
    "opendiscord:tickets-closed":api.ODBasicStat,
    "opendiscord:tickets-deleted":api.ODBasicStat,
    "opendiscord:tickets-reopened":api.ODBasicStat,
    "opendiscord:tickets-autoclosed":api.ODBasicStat,
    "opendiscord:tickets-autodeleted":api.ODBasicStat,
    "opendiscord:tickets-claimed":api.ODBasicStat,
    "opendiscord:tickets-pinned":api.ODBasicStat,
    "opendiscord:tickets-moved":api.ODBasicStat,
    "opendiscord:tickets-transferred":api.ODBasicStat,
    "opendiscord:users-blacklisted":api.ODBasicStat,
    "opendiscord:transcripts-created":api.ODBasicStat,
    "opendiscord:ticket-volume":api.ODDynamicStat,
    "opendiscord:average-tickets":api.ODDynamicStat,
}

/**## ODStatGlobalScope_DefaultGlobal `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:global` category in `opendiscord.stats`!
 */
export class ODStatGlobalScope_DefaultGlobal extends api.ODStatGlobalScope {
    get<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): ODStatGlobalScopeIds_DefaultGlobal[StatsId]
    get(id:api.ODValidId): api.ODStat|null
    
    get(id:api.ODValidId): api.ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): ODStatGlobalScopeIds_DefaultGlobal[StatsId]
    remove(id:api.ODValidId): api.ODStat|null
    
    remove(id:api.ODValidId): api.ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatGlobalScopeIds_DefaultGlobal): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): Promise<api.ODValidStatValue|null>
    getStat(id:api.ODValidId): Promise<api.ODValidStatValue|null>

    getStat(id:api.ODValidId): Promise<api.ODValidStatValue|null> {
        return super.getStat(id)
    }

    getAllStats<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): Promise<{id:string,value:api.ODValidStatValue}[]>
    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]>

    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]> {
        return super.getAllStats(id)
    }

    setStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>
    setStat(id:api.ODValidId, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>

    setStat(id:api.ODValidId, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,value,mode)
    }

    resetStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:api.ODValidId): Promise<api.ODValidStatValue|null>
    resetStat(id:api.ODValidId): Promise<api.ODValidStatValue|null>

    resetStat(id:api.ODValidId): Promise<api.ODValidStatValue|null> {
        return super.resetStat(id)
    }
}

/**## ODStatGlobalScopeIds_DefaultSystem `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultSystem` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatGlobalScopeIds_DefaultSystem {
    "opendiscord:startup-date":api.ODDynamicStat,
    "opendiscord:system-uptime":api.ODDynamicStat,
    "opendiscord:version":api.ODDynamicStat
}

/**## ODStatGlobalScope_DefaultSystem `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:system` category in `opendiscord.stats`!
 */
export class ODStatGlobalScope_DefaultSystem extends api.ODStatGlobalScope {
    get<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): ODStatGlobalScopeIds_DefaultSystem[StatsId]
    get(id:api.ODValidId): api.ODStat|null
    
    get(id:api.ODValidId): api.ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): ODStatGlobalScopeIds_DefaultSystem[StatsId]
    remove(id:api.ODValidId): api.ODStat|null
    
    remove(id:api.ODValidId): api.ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatGlobalScopeIds_DefaultSystem): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): Promise<api.ODValidStatValue|null>
    getStat(id:api.ODValidId): Promise<api.ODValidStatValue|null>

    getStat(id:api.ODValidId): Promise<api.ODValidStatValue|null> {
        return super.getStat(id)
    }

    getAllStats<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): Promise<{id:string,value:api.ODValidStatValue}[]>
    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]>

    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]> {
        return super.getAllStats(id)
    }

    setStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>
    setStat(id:api.ODValidId, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>

    setStat(id:api.ODValidId, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,value,mode)
    }

    resetStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:api.ODValidId): Promise<api.ODValidStatValue|null>
    resetStat(id:api.ODValidId): Promise<api.ODValidStatValue|null>

    resetStat(id:api.ODValidId): Promise<api.ODValidStatValue|null> {
        return super.resetStat(id)
    }
}

/**## ODStatScopeIds_DefaultUser `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultUser` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultUser {
    "opendiscord:name":api.ODDynamicStat,
    "opendiscord:role":api.ODDynamicStat,
    "opendiscord:tickets-created":api.ODBasicStat,
    "opendiscord:tickets-closed":api.ODBasicStat,
    "opendiscord:tickets-deleted":api.ODBasicStat,
    "opendiscord:tickets-reopened":api.ODBasicStat,
    "opendiscord:tickets-claimed":api.ODBasicStat,
    "opendiscord:tickets-pinned":api.ODBasicStat,
    "opendiscord:tickets-moved":api.ODBasicStat,
    "opendiscord:tickets-transferred":api.ODBasicStat,
    "opendiscord:users-blacklisted":api.ODBasicStat,
    "opendiscord:transcripts-created":api.ODBasicStat,
    "opendiscord:current-tickets":api.ODDynamicStat,
}

/**## ODStatScope_DefaultUser `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:user` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultUser extends api.ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId): ODStatScopeIds_DefaultUser[StatsId]
    get(id:api.ODValidId): api.ODStat|null
    
    get(id:api.ODValidId): api.ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId): ODStatScopeIds_DefaultUser[StatsId]
    remove(id:api.ODValidId): api.ODStat|null
    
    remove(id:api.ODValidId): api.ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultUser): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId, scopeId:string): Promise<api.ODValidStatValue|null>
    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    getAllStats<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId): Promise<{id:string,value:api.ODValidStatValue}[]>
    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]>

    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]> {
        return super.getAllStats(id)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>
    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>

    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>
    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}

/**## ODStatScopeIds_DefaultTicket `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultTicket` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultTicket {
    "opendiscord:name":api.ODDynamicStat,
    "opendiscord:status":api.ODDynamicStat,
    "opendiscord:claimed":api.ODDynamicStat,
    "opendiscord:pinned":api.ODDynamicStat,
    "opendiscord:creation-date":api.ODDynamicStat,
    "opendiscord:creator":api.ODDynamicStat,
    "opendiscord:ticket-age":api.ODDynamicStat,
    "opendiscord:response-time":api.ODDynamicStat,
    "opendiscord:resolution-time":api.ODDynamicStat,
}

/**## ODStatScope_DefaultTicket `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultTicket extends api.ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId): ODStatScopeIds_DefaultTicket[StatsId]
    get(id:api.ODValidId): api.ODStat|null
    
    get(id:api.ODValidId): api.ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId): ODStatScopeIds_DefaultTicket[StatsId]
    remove(id:api.ODValidId): api.ODStat|null
    
    remove(id:api.ODValidId): api.ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultTicket): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId, scopeId:string): Promise<api.ODValidStatValue|null>
    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    getAllStats<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId): Promise<{id:string,value:api.ODValidStatValue}[]>
    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]>

    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]> {
        return super.getAllStats(id)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>
    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>

    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>
    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}

/**## ODStatScopeIds_DefaultParticipants `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultParticipants` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultParticipants {
    "opendiscord:participants":api.ODDynamicStat
}

/**## ODStatScope_DefaultParticipants `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:participants` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultParticipants extends api.ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId): ODStatScopeIds_DefaultParticipants[StatsId]
    get(id:api.ODValidId): api.ODStat|null
    
    get(id:api.ODValidId): api.ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId): ODStatScopeIds_DefaultParticipants[StatsId]
    remove(id:api.ODValidId): api.ODStat|null
    
    remove(id:api.ODValidId): api.ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultParticipants): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId, scopeId:string): Promise<api.ODValidStatValue|null>
    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    getAllStats<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId): Promise<{id:string,value:api.ODValidStatValue}[]>
    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]>

    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]> {
        return super.getAllStats(id)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>
    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>

    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>
    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}

/**## ODStatScopeIds_DefaultMessages `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultMessages` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultMessages {
    "opendiscord:count":api.ODDynamicStat
}

/**## ODStatScope_DefaultMessages `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:participants` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultMessages extends api.ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultMessages>(id:StatsId): ODStatScopeIds_DefaultMessages[StatsId]
    get(id:api.ODValidId): api.ODStat|null
    
    get(id:api.ODValidId): api.ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultMessages>(id:StatsId): ODStatScopeIds_DefaultMessages[StatsId]
    remove(id:api.ODValidId): api.ODStat|null
    
    remove(id:api.ODValidId): api.ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultMessages): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultMessages>(id:StatsId, scopeId:string): Promise<api.ODValidStatValue|null>
    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    getStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    getAllStats<StatsId extends keyof ODStatScopeIds_DefaultMessages>(id:StatsId): Promise<{id:string,value:api.ODValidStatValue}[]>
    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]>

    getAllStats(id:api.ODValidId): Promise<{id:string,value:api.ODValidStatValue}[]> {
        return super.getAllStats(id)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultMessages>(id:StatsId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>
    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean>

    setStat(id:api.ODValidId, scopeId:string, value:api.ODValidStatValue, mode:api.ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultMessages>(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>
    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null>

    resetStat(id:api.ODValidId, scopeId:string): Promise<api.ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}