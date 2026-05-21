///////////////////////////////////////
//OPEN TICKET STARTSCREEN MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODLiveStatusManagerIdMappings } from "./console.js"

/**## ODStartScreenManagerIdMappings `interface`
 * A list of all available IDs in the default `ODStartScreenManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStartScreenManagerIdMappings extends api.ODStartScreenManagerIdConstraint {
    "opendiscord:logo":api.ODStartScreenLogoComponent,
    "opendiscord:header":api.ODStartScreenHeaderComponent,
    "opendiscord:flags":api.ODStartScreenFlagsCategoryComponent,
    "opendiscord:plugins":api.ODStartScreenPluginsCategoryComponent,
    "opendiscord:stats":api.ODStartScreenPropertiesCategoryComponent,
    "opendiscord:livestatus":api.ODStartScreenLiveStatusCategoryComponent<api.ODLiveStatusManager<ODLiveStatusManagerIdMappings>>,
    "opendiscord:logs":api.ODStartScreenCategoryComponent
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedStartScreenManager `class
 * A special class with types for the Open Ticket `ODStartScreenManager` class.
 */
export class ODMappedStartScreenManager extends api.ODStartScreenManager<ODStartScreenManagerIdMappings> {}