///////////////////////////////////////
//DEFAULT PERMISSION MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODClientManager_Default } from "./client"

/**## ODPermissionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODPermissionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.permissions`!
 */
export class ODPermissionManager_Default extends api.ODPermissionManager {
    constructor(debug:api.ODDebugger,client:ODClientManager_Default){
        super(debug,client,true)
    }
}

/**## ODPermissionEmbedType `type`
 * This type contains all types available in the `opendiscord:no-permissions` embed.
 */
export type ODPermissionEmbedType = (
    "developer"|
    "owner"|
    "admin"|
    "moderator"|
    "support"|
    "member"|
    "discord-administrator"
)