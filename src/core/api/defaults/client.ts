///////////////////////////////////////
//DEFAULT CLIENT MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/** (CONTRIBUTOR GUIDE) HOW TO ADD NEW COMMANDS?
 * - Register the command in loadAllSlashCommands() & loadAllTextCommands() in (./src/data/framework/commandLoader.ts)
 * - Add autocomplete for the command in OD(Slash/Text)CommandManagerIds_Default in (./src/core/api/defaults/client.ts)
 * - Add the command to the help menu in (./src/data/framework/helpMenuLoader.ts)
 * - If required, new config variables should be added (incl. logs, dm-logs & permissions).
 * - Update the Open Ticket Documentation.
 * - If the command contains complex logic or can be executed from a button/dropdown, it should be placed inside an `ODAction`.
 * - Check all files, test the bot carefully & try a lot of different scenario's with different settings.
 */

/**## ODClientManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODClientManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client`!
 */
export class ODClientManager_Default extends api.ODClientManager {
    declare slashCommands: ODSlashCommandManager_Default
    declare textCommands: ODTextCommandManager_Default
    declare contextMenus: ODContextMenuManager_Default
}

/**## ODSlashCommandManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODSlashCommandManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSlashCommandManagerIds_Default {
    "opendiscord:help":api.ODSlashCommand,
    "opendiscord:panel":api.ODSlashCommand,
    "opendiscord:ticket":api.ODSlashCommand,
    "opendiscord:close":api.ODSlashCommand,
    "opendiscord:delete":api.ODSlashCommand,
    "opendiscord:reopen":api.ODSlashCommand,
    "opendiscord:claim":api.ODSlashCommand,
    "opendiscord:unclaim":api.ODSlashCommand,
    "opendiscord:pin":api.ODSlashCommand,
    "opendiscord:unpin":api.ODSlashCommand,
    "opendiscord:move":api.ODSlashCommand,
    "opendiscord:rename":api.ODSlashCommand,
    "opendiscord:add":api.ODSlashCommand,
    "opendiscord:remove":api.ODSlashCommand,
    "opendiscord:blacklist":api.ODSlashCommand,
    "opendiscord:stats":api.ODSlashCommand,
    "opendiscord:clear":api.ODSlashCommand,
    "opendiscord:autoclose":api.ODSlashCommand,
    "opendiscord:autodelete":api.ODSlashCommand,
    "opendiscord:topic":api.ODSlashCommand,
    "opendiscord:priority":api.ODSlashCommand,
    "opendiscord:transfer":api.ODSlashCommand,
}

/**## ODSlashCommandManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODSlashCommandManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client.slashCommands`!
 */
export class ODSlashCommandManager_Default extends api.ODSlashCommandManager {
    get<SlashCommandId extends keyof ODSlashCommandManagerIds_Default>(id:SlashCommandId): ODSlashCommandManagerIds_Default[SlashCommandId]
    get(id:api.ODValidId): api.ODSlashCommand|null
    
    get(id:api.ODValidId): api.ODSlashCommand|null {
        return super.get(id)
    }
    
    remove<SlashCommandId extends keyof ODSlashCommandManagerIds_Default>(id:SlashCommandId): ODSlashCommandManagerIds_Default[SlashCommandId]
    remove(id:api.ODValidId): api.ODSlashCommand|null
    
    remove(id:api.ODValidId): api.ODSlashCommand|null {
        return super.remove(id)
    }

    exists(id:keyof ODSlashCommandManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    onInteraction(commandName:keyof ODSlashCommandManagerIds_Default, callback:api.ODSlashCommandInteractionCallback): void
    onInteraction(commandName:string|RegExp, callback:api.ODSlashCommandInteractionCallback): void

    onInteraction(commandName:string|RegExp, callback:api.ODSlashCommandInteractionCallback): void {
        return super.onInteraction(commandName,callback)
    }
}

/**## ODTextCommandManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODTextCommandManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTextCommandManagerIds_Default {
    "opendiscord:dump":api.ODTextCommand,
    "opendiscord:help":api.ODTextCommand,
    "opendiscord:panel":api.ODTextCommand,
    "opendiscord:close":api.ODTextCommand,
    "opendiscord:delete":api.ODTextCommand,
    "opendiscord:reopen":api.ODTextCommand,
    "opendiscord:claim":api.ODTextCommand,
    "opendiscord:unclaim":api.ODTextCommand,
    "opendiscord:pin":api.ODTextCommand,
    "opendiscord:unpin":api.ODTextCommand,
    "opendiscord:move":api.ODTextCommand,
    "opendiscord:rename":api.ODTextCommand,
    "opendiscord:add":api.ODTextCommand,
    "opendiscord:remove":api.ODTextCommand,
    "opendiscord:blacklist-view":api.ODTextCommand,
    "opendiscord:blacklist-add":api.ODTextCommand,
    "opendiscord:blacklist-remove":api.ODTextCommand,
    "opendiscord:blacklist-get":api.ODTextCommand,
    "opendiscord:stats-global":api.ODTextCommand,
    "opendiscord:stats-reset":api.ODTextCommand,
    "opendiscord:stats-ticket":api.ODTextCommand,
    "opendiscord:stats-user":api.ODTextCommand,
    "opendiscord:clear":api.ODTextCommand,
    "opendiscord:autoclose-disable":api.ODTextCommand,
    "opendiscord:autoclose-enable":api.ODTextCommand,
    "opendiscord:autodelete-disable":api.ODTextCommand,
    "opendiscord:autodelete-enable":api.ODTextCommand,
    "opendiscord:topic-set":api.ODTextCommand,
    "opendiscord:priority-set":api.ODTextCommand,
    "opendiscord:priority-get":api.ODTextCommand,
    "opendiscord:transfer":api.ODTextCommand,
}

/**## ODTextCommandManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODTextCommandManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client.textCommands`!
 */
export class ODTextCommandManager_Default extends api.ODTextCommandManager {
    get<TextCommandId extends keyof ODTextCommandManagerIds_Default>(id:TextCommandId): ODTextCommandManagerIds_Default[TextCommandId]
    get(id:api.ODValidId): api.ODTextCommand|null
    
    get(id:api.ODValidId): api.ODTextCommand|null {
        return super.get(id)
    }
    
    remove<TextCommandId extends keyof ODTextCommandManagerIds_Default>(id:TextCommandId): ODTextCommandManagerIds_Default[TextCommandId]
    remove(id:api.ODValidId): api.ODTextCommand|null
    
    remove(id:api.ODValidId): api.ODTextCommand|null {
        return super.remove(id)
    }

    exists(id:keyof ODTextCommandManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    onInteraction(commandPrefix:string, commandName:string|RegExp, callback:api.ODTextCommandInteractionCallback): void {
        return super.onInteraction(commandPrefix,commandName,callback)
    }
}

/**## ODContextMenuManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODContextMenuManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODContextMenuManagerIds_Default {
    //"opendiscord:test-menu":ODContextMenu
}

/**## ODContextMenuManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODContextMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client.contextMenus`!
 */
export class ODContextMenuManager_Default extends api.ODContextMenuManager {
    get<ContextMenuId extends keyof ODContextMenuManagerIds_Default>(id:ContextMenuId): ODContextMenuManagerIds_Default[ContextMenuId]
    get(id:api.ODValidId): api.ODContextMenu|null
    
    get(id:api.ODValidId): api.ODContextMenu|null {
        return super.get(id)
    }
    
    remove<ContextMenuId extends keyof ODContextMenuManagerIds_Default>(id:ContextMenuId): ODContextMenuManagerIds_Default[ContextMenuId]
    remove(id:api.ODValidId): api.ODContextMenu|null
    
    remove(id:api.ODValidId): api.ODContextMenu|null {
        return super.remove(id)
    }

    exists(id:keyof ODContextMenuManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    onInteraction(menuName:keyof ODContextMenuManagerIds_Default, callback:api.ODContextMenuInteractionCallback): void
    onInteraction(menuName:string|RegExp, callback:api.ODContextMenuInteractionCallback): void

    onInteraction(menuName:string|RegExp, callback:api.ODContextMenuInteractionCallback): void {
        return super.onInteraction(menuName,callback)
    }
}