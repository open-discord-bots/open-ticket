///////////////////////////////////////
//DEFAULT WORKER MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODWorkerManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODWorkerManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the worker manager in actions, builders & responders!
 */
export class ODWorkerManager_Default<Instance, Source extends string, Params, WorkerIds extends string> extends api.ODWorkerManager<Instance,Source,Params> {
    get(id:WorkerIds): api.ODWorker<Instance,Source,Params>
    get(id:api.ODValidId): api.ODWorker<Instance,Source,Params>|null
    
    get(id:api.ODValidId): api.ODWorker<Instance,Source,Params>|null {
        return super.get(id)
    }

    remove(id:WorkerIds): api.ODWorker<Instance,Source,Params>
    remove(id:api.ODValidId): api.ODWorker<Instance,Source,Params>|null
    
    remove(id:api.ODValidId): api.ODWorker<Instance,Source,Params>|null {
        return super.remove(id)
    }

    exists(id:WorkerIds): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}