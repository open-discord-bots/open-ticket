///////////////////////////////////////
//DEFAULT HELP MODULE
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

/**## ODHelpMenuManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODHelpMenuManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerIds_Default {
    "opendiscord:general":ODHelpMenuCategory_DefaultGeneral,
    "opendiscord:ticket-basic":ODHelpMenuCategory_DefaultTicketBasic,
    "opendiscord:ticket-advanced":ODHelpMenuCategory_DefaultTicketAdvanced,
    "opendiscord:ticket-user":ODHelpMenuCategory_DefaultTicketUser,
    "opendiscord:admin":ODHelpMenuCategory_DefaultAdmin,
    "opendiscord:advanced":ODHelpMenuCategory_DefaultAdvanced,
    "opendiscord:extra":ODHelpMenuCategory_DefaultExtra
}

/**## ODHelpMenuManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.helpmenu`!
 */
export class ODHelpMenuManager_Default extends api.ODHelpMenuManager {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerIds_Default>(id:HelpMenuCategoryId): ODHelpMenuManagerIds_Default[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuCategory|null
    
    get(id:api.ODValidId): api.ODHelpMenuCategory|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerIds_Default>(id:HelpMenuCategoryId): ODHelpMenuManagerIds_Default[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuCategory|null
    
    remove(id:api.ODValidId): api.ODHelpMenuCategory|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultGeneral `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultGeneral` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultGeneral {
    "opendiscord:help":api.ODHelpMenuCommandComponent,
    "opendiscord:ticket":api.ODHelpMenuCommandComponent|null
}

/**## ODHelpMenuCategory_DefaultGeneral `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:general` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultGeneral extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultGeneral>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultGeneral[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultGeneral>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultGeneral[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultGeneral): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultTicketBasic `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultTicketBasic` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultTicketBasic {
    "opendiscord:close":api.ODHelpMenuCommandComponent,
    "opendiscord:delete":api.ODHelpMenuCommandComponent,
    "opendiscord:reopen":api.ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketBasic `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultTicketBasic extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketBasic>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketBasic[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketBasic>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketBasic[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultTicketBasic): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultTicketAdvanced` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced {
    "opendiscord:pin":api.ODHelpMenuCommandComponent,
    "opendiscord:unpin":api.ODHelpMenuCommandComponent,
    "opendiscord:move":api.ODHelpMenuCommandComponent,
    "opendiscord:rename":api.ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketAdvanced `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultTicketAdvanced extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultTicketUser `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultTicketUser` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultTicketUser {
    "opendiscord:claim":api.ODHelpMenuCommandComponent,
    "opendiscord:unclaim":api.ODHelpMenuCommandComponent,
    "opendiscord:add":api.ODHelpMenuCommandComponent,
    "opendiscord:remove":api.ODHelpMenuCommandComponent,
    "opendiscord:transfer":api.ODHelpMenuCommandComponent,
}

/**## ODHelpMenuCategory_DefaultTicketUser `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultTicketUser extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketUser>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketUser[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketUser>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketUser[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultTicketUser): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultAdmin `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultAdmin` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultAdmin {
    "opendiscord:panel":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-view":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-add":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-remove":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-get":api.ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultAdmin `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:admin` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultAdmin extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdmin>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdmin[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdmin>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdmin[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultAdmin): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultAdvanced `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultAdvanced` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultAdvanced {
    "opendiscord:stats-global":api.ODHelpMenuCommandComponent,
    "opendiscord:stats-reset":api.ODHelpMenuCommandComponent,
    "opendiscord:stats-ticket":api.ODHelpMenuCommandComponent,
    "opendiscord:stats-user":api.ODHelpMenuCommandComponent,
    "opendiscord:autoclose-disable":api.ODHelpMenuCommandComponent,
    "opendiscord:autoclose-enable":api.ODHelpMenuCommandComponent,
    "opendiscord:autodelete-disable":api.ODHelpMenuCommandComponent,
    "opendiscord:autodelete-enable":api.ODHelpMenuCommandComponent,
    "opendiscord:topic-set":api.ODHelpMenuCommandComponent,
    "opendiscord:priority-set":api.ODHelpMenuCommandComponent,
}

/**## ODHelpMenuCategory_DefaultAdvanced `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:advanced` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultAdvanced extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdvanced[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdvanced[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultAdvanced): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultExtra `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultExtra` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultExtra {}

/**## ODHelpMenuCategory_DefaultExtra `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:general` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultExtra extends api.ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultExtra>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultExtra[HelpMenuCategoryId]
    get(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    get(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultExtra>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultExtra[HelpMenuCategoryId]
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null
    
    remove(id:api.ODValidId): api.ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultExtra): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}