///////////////////////////////////////
//DEFAULT POST MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"

/**## ODPostManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODPostManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPostManagerIds_Default {
    "opendiscord:logs":api.ODPost<discord.GuildTextBasedChannel>|null,
    "opendiscord:transcripts":api.ODPost<discord.GuildTextBasedChannel>|null
}

/**## ODPostManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODPostManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.code`!
 */
export class ODPostManager_Default extends api.ODPostManager {
    get<PostId extends keyof ODPostManagerIds_Default>(id:PostId): ODPostManagerIds_Default[PostId]
    get(id:api.ODValidId): api.ODPost<discord.GuildBasedChannel>|null
    
    get(id:api.ODValidId): api.ODPost<discord.GuildBasedChannel>|null {
        return super.get(id)
    }

    remove<PostId extends keyof ODPostManagerIds_Default>(id:PostId): ODPostManagerIds_Default[PostId]
    remove(id:api.ODValidId): api.ODPost<discord.GuildBasedChannel>|null
    
    remove(id:api.ODValidId): api.ODPost<discord.GuildBasedChannel>|null {
        return super.remove(id)
    }

    exists(id:keyof ODPostManagerIds_Default): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}