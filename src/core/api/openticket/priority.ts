///////////////////////////////////////
//OPENTICKET PRIORITY MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"
import * as discord from "discord.js"

/**## ODPriorityManager `class`
 * This is an Open Ticket priority manager.
 * 
 * This class manages all registered priority levels in the bot.
 * 
 * Priorities levels can be changed/updated/translated by plugins to allow for more customisability.
 */
export class ODPriorityManager extends ODManager<ODPriority> {
    /**A reference to the Open Ticket debugger. */
    #debug: ODDebugger

    constructor(debug:ODDebugger){
        super(debug,"priority")
        this.#debug = debug
    }
}

/**## ODPriorityIds `type`
 * This interface is a list of ids available in the `ODPriorityManager` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPriorityIds {
    "opendiscord:urgent":ODPriority,
    "opendiscord:very-high":ODPriority,
    "opendiscord:high":ODPriority,
    "opendiscord:normal":ODPriority,
    "opendiscord:low":ODPriority,
    "opendiscord:very-low":ODPriority,
    "opendiscord:none":ODPriority,
}

/**## ODPriorityManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODPriorityManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.priorities`!
 */
export class ODPriorityManager_Default extends ODPriorityManager {
    get<PriorityId extends keyof ODPriorityIds>(id:PriorityId): ODPriorityIds[PriorityId]
    get(id:ODValidId): ODPriority|null
    
    get(id:ODValidId): ODPriority|null {
        return super.get(id)
    }

    remove<PriorityId extends keyof ODPriorityIds>(id:PriorityId): ODPriorityIds[PriorityId]
    remove(id:ODValidId): ODPriority|null
    
    remove(id:ODValidId): ODPriority|null {
        return super.remove(id)
    }

    exists(id:keyof ODPriorityIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODPriority `class`
 * This is an Open Ticket priority level.
 * 
 * Using this class, you can register or edit a priority level for the ticket priority system.
 * 
 * Priority levels should be registered in `opendiscord.priorities`.
 * 
 * #### 🚨 Negative priorities are treated as `disabled/no-priority`!
 */
export class ODPriority extends ODManagerData {
    /**The priority level itself. A negative number (e.g. `-1`) is treated as `disabled/no-priority`. */
    priority:number
    /**The raw name of the level (used in text/slash command inputs). */
    rawName:string
    /**The display name of the level (used in embeds & messages). */
    displayName:string
    /**The display emoji of the level (used in embeds & messages). */
    displayEmoji:string|null
    /**The emoji added to the channel name when the level is applied to a ticket. */
    channelEmoji:string|null

    constructor(id:ODValidId,priority:number,rawName:string,displayName:string,displayEmoji:string|null,channelEmoji:string|null){
        super(id)
        this.priority = priority
        this.rawName = rawName
        this.displayName = displayName
        this.displayEmoji = displayEmoji
        this.channelEmoji = channelEmoji
    }
    /**Get the display name + emoji for rendering this priority in the UI/embeds. */
    renderDisplayName(){
        return (this.displayEmoji ? this.displayEmoji+" " : "")+this.displayName
    }
}