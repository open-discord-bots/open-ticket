///////////////////////////////////////
//BASE MODULE
///////////////////////////////////////
import * as fs from "fs"
import { ODConsoleWarningMessage, ODDebugger } from "./console"

/**## ODPromiseVoid `type`
 * This is a simple type to represent a callback return value that could be a promise or not.
 */
export type ODPromiseVoid = void|Promise<void>

/**## ODOptionalPromise `type`
 * This is a simple type to represent a type as normal value or a promise value.
 */
export type ODOptionalPromise<T> = T|Promise<T>


/**## ODValidButtonColor `type`
 * This is a collection of all the possible button colors.
 */
export type ODValidButtonColor = "gray"|"red"|"green"|"blue"

/**## ODValidId `type`
 * This is a valid Open Ticket identifier. It can be an `ODId` or `string`!
 * 
 * You will see this type in many functions from Open Ticket.
 */
export type ODValidId = string|ODId

/**## ODValidJsonType `type`
 * This is a collection of all types that can be stored in a JSON file!
 * 
 * list: `string`, `number`, `boolean`, `array`, `object`, `null`
 */
export type ODValidJsonType = string|number|boolean|object|ODValidJsonType[]|null


/**## ODInterfaceWithPartialProperty `type`
 * This is a utility type to create an interface where some properties are optional!
 */
export type ODInterfaceWithPartialProperty<Interface,Key extends keyof Interface> = Omit<Interface,Key> & Partial<Pick<Interface,Key>>

/**## ODDiscordIdType `type`
 * A list of all available discord ID types. Used in the config checker.
 */
export type ODDiscordIdType = "role"|"server"|"channel"|"category"|"user"|"member"|"interaction"|"message"

/**## ODId `class`
 * This is an Open Ticket identifier.
 * 
 * It can only contain the following characters: `a-z`, `A-Z`, `0-9`, `:`, `-` & `_`
 * 
 * You can use this class to assign a unique id when creating configs, databases, languages & more!
 */
export class ODId {
    /**The full value of this `ODId` as a `string`. */
    #value: string
    /**The full value of this `ODId` as a `string`. */
    set value(id:string){
        this._change(this.#value,id)
        this.#value = id
    }
    get value(){
        return this.#value
    }
    /**The change listener for the parent `ODManager` of this `ODId`. */
    #change: ((oldId:string,newId:string) => void)|null = null

    constructor(id:ODValidId){
        if (typeof id != "string" && !(id instanceof ODId)) throw new ODSystemError("Invalid constructor parameter => id:ODValidId")

        if (typeof id == "string"){
            //id is string
            const result: string[] = []
            const charregex = /[a-zA-Z0-9éèçàêâôûî\:\-\_]/

            id.split("").forEach((char) => {
                if (charregex.test(char)){
                    result.push(char)
                }
            })

            if (result.length > 0) this.#value = result.join("")
            else throw new ODSystemError("invalid ID at 'new ODID(id: "+id+")'")
        }else{
            //id is ODId
            this.#value = id.#value
        }
    }

    /**Returns a string representation of this id. (same as `this.value`) */
    toString(){
        return this.#value
    }
    /**The namespace of the id before `:`. (e.g. `openticket` for `openticket:autoclose-enabled`) */
    getNamespace(){
        const splitted = this.#value.split(":")
        if (splitted.length > 1) return splitted[0]
        else return ""
    }
    /**The identifier of the id after `:`. (e.g. `autoclose-enabled` for `openticket:autoclose-enabled`) */
    getIdentifier(){
        const splitted = this.#value.split(":")
        if (splitted.length > 1){
            splitted.shift()
            return splitted.join(":")
        }else return this.#value
    }
    /**Trigger an `onChange()` event in the parent `ODManager` of this class. */
    protected _change(oldId:string,newId:string){
        if (this.#change){
            try{
                this.#change(oldId,newId)
            }catch(err){
                process.emit("uncaughtException",err)
                throw new ODSystemError("Failed to execute _change() callback!")
            }
        }
    }
    /****(❌ SYSTEM ONLY!!)** Set the callback executed when a value inside this class changes. */
    changed(callback:((oldId:string,newId:string) => void)|null){
        this.#change = callback
    }
}

/**## ODManagerChangeHelper `class`
 * This is an Open Ticket manager change helper.
 * 
 * It is used to let the "onChange" event in the `ODManager` class work.
 * You can use this class when extending your own `ODManager`
 */
export class ODManagerChangeHelper {
    #change: (() => void)|null = null

    /**Trigger an `onChange()` event in the parent `ODManager` of this class. */
    protected _change(){
        if (this.#change){
            try{
                this.#change()
            }catch(err){
                process.emit("uncaughtException",err)
                throw new ODSystemError("Failed to execute _change() callback!")
            }
        }
    }
    /****(❌ SYSTEM ONLY!!)** Set the callback executed when a value inside this class changes. */
    changed(callback:(() => void)|null){
        this.#change = callback
    }
}

/**## ODManagerData `class`
 * This is Open Ticket manager data.
 * 
 * It provides a template for all classes that are used in the `ODManager`.
 * 
 * There is an `id:ODId` property & also some events used in the manager.
 */
export class ODManagerData extends ODManagerChangeHelper {
    /**The id of this data. */
    id: ODId

    constructor(id:ODValidId){
        if (typeof id != "string" && !(id instanceof ODId)) throw new ODSystemError("Invalid constructor parameter => id:ODValidId")
        super()
        this.id = new ODId(id)
    }
}

/**## ODManagerCallback `type`
 * This is a callback for the `onChange` and `onRemove` events in the `ODManager`
 */
export type ODManagerCallback<DataType extends ODManagerData> = (data:DataType) => void
/**## ODManagerAddCallback `type`
 * This is a callback for the `onAdd` event in the `ODManager`
 */
export type ODManagerAddCallback<DataType extends ODManagerData> = (data:DataType, overwritten:boolean) => void 

/**## ODManager `class`
 * This is an Open Ticket manager.
 * 
 * It can be used to store & manage classes based on their `ODId`.
 * It is somewhat the same as the default JS `Map()`.
 * You can extend this class when creating your own classes & managers.
 * 
 * This class has many useful functions based on `ODId` (add, get, remove, getAll, getFiltered, exists, loopAll, ...)
 */
export class ODManager<DataType extends ODManagerData> extends ODManagerChangeHelper {
    /**Alias to Open Ticket debugger. */
    #debug?: ODDebugger
    /**The message to send when debugging this manager. */
    #debugname?: string
    /**The map storing all data classes in this manager. */
    #data: Map<string,DataType> = new Map()
    /**An array storing all listeners when data is added. */
    #addListeners: ODManagerAddCallback<DataType>[] = []
    /**An array storing all listeners when data has changed. */
    #changeListeners: ODManagerCallback<DataType>[] = []
    /**An array storing all listeners when data is removed. */
    #removeListeners: ODManagerCallback<DataType>[] = []
    
    constructor(debug?:ODDebugger, debugname?:string){
         super()
        this.#debug = debug
        this.#debugname = debugname
    }
    
    /**Add data to the manager. The `ODId` in the data class will be used as identifier! You can optionally select to overwrite existing data!*/
    add(data:DataType|DataType[], overwrite?:boolean): boolean {
        //repeat same command when data is an array
        if (Array.isArray(data)){
            data.forEach((arrayData) => {
                this.add(arrayData,overwrite)
            })
            return false
        }

        //add listener for data id change => transfer data within manager
        data.id.changed((oldId,newId) => {
            this.#data.delete(oldId)
            this.#data.set(newId,data)
        })

        //add data
        let didOverwrite: boolean
        if (this.#data.has(data.id.value)){
            if (!overwrite) throw new ODSystemError("Id '"+data.id.value+"' already exists in "+this.#debugname+" manager. Use 'overwrite:true' to allow overwriting!")
            this.#data.set(data.id.value,data)
            didOverwrite = true
            if (this.#debug) this.#debug.debug("Added new "+this.#debugname+" to manager",[{key:"id",value:data.id.value},{key:"overwrite",value:"true"}])
            
        }else{
            this.#data.set(data.id.value,data)
            didOverwrite = false
            if (this.#debug) this.#debug.debug("Added new "+this.#debugname+" to manager",[{key:"id",value:data.id.value},{key:"overwrite",value:"false"}])
            
        }

        //emit change listeners
        data.changed(() => {
            //notify change in upper-manager (because data in this manager changed)
            this._change()
            this.#changeListeners.forEach((cb) => {
                try{
                    cb(data)
                }catch(err){
                    throw new ODSystemError("Failed to run manager onChange() listener.\n"+err)
                }
            })
        })

        //emit add listeners
        this.#addListeners.forEach((cb) => {
            try{
                cb(data,didOverwrite)
            }catch(err){
                throw new ODSystemError("Failed to run manager onAdd() listener.\n"+err)
            }
        })

        //notify change in upper-manager (because data added)
        this._change()

        return didOverwrite
    }
    /**Get data that matches the `ODId`. Returns the found data.*/
    get(id:ODValidId): DataType|null {
        const newId = new ODId(id)
        const data = this.#data.get(newId.value)
        if (data) return data
        else return null
    }
    /**Remove data that matches the `ODId`. Returns the removed data. */
    remove(id:ODValidId): DataType|null {
        const newId = new ODId(id)
        const data = this.#data.get(newId.value)
        
        if (!data){
            if (this.#debug) this.#debug.debug("Removed "+this.#debugname+" from manager",[{key:"id",value:newId.value},{key:"found",value:"false"}])
            return null
        }else{
            this.#data.delete(newId.value)
            if (this.#debug) this.#debug.debug("Removed "+this.#debugname+" from manager",[{key:"id",value:newId.value},{key:"found",value:"true"}])
        }
                
        //remove all listeners
        data.id.changed(null)
        data.changed(null)

        //emit remove listeners
        this.#removeListeners.forEach((cb) => {
            try{
                cb(data)
            }catch(err){
                throw new ODSystemError("Failed to run manager onRemove() listener.\n"+err)
            }
        })

        //notify change in upper-manager (because data removed)
        this._change()

        return data
    }
    /**Check if data that matches the `ODId` exists. Returns a boolean. */
    exists(id:ODValidId): boolean {
        const newId = new ODId(id)
        if (this.#data.has(newId.value)) return true
        else return false
    }
    /**Get all data inside this manager*/
    getAll(): DataType[] {
        return Array.from(this.#data.values())
    }
    /**Get all data that matches inside the filter function*/
    getFiltered(predicate:(value:DataType, index:number, array:DataType[]) => unknown): DataType[] {
        return Array.from(this.#data.values()).filter(predicate)
    }
    /**Get all data where the `ODId` matches the provided RegExp. */
    getRegex(regex:RegExp): DataType[] {
        return Array.from(this.#data.values()).filter((data) => regex.test(data.id.value))
    }
    /**Get the length/size/amount of the data inside this manager. */
    getLength(){
        return this.#data.size
    }
    /**Get a list of all the ids inside this manager*/
    getIds(): ODId[] {
        const ids = Array.from(this.#data.keys())
        return ids.map((id) => new ODId(id))
    }
    /**Run an iterator over all data in this manager. This method also supports async-await behaviour!*/
    async loopAll(cb:(data:DataType,id:ODId) => ODPromiseVoid): Promise<void> {
        for (const data of this.getAll()){
            await cb(data,data.id)
        }
    }
    /**Use the Open Ticket debugger in this manager for logs*/
    useDebug(debug?:ODDebugger, debugname?:string){
        this.#debug = debug
        this.#debugname = debugname
    }
    /**Listen for when data is added to this manager. */
    onAdd(callback:ODManagerAddCallback<DataType>){
        this.#addListeners.push(callback)
    }
    /**Listen for when data is changed in this manager. */
    onChange(callback:ODManagerCallback<DataType>){
        this.#changeListeners.push(callback)
    }
    /**Listen for when data is removed from this manager. */
    onRemove(callback:ODManagerCallback<DataType>){
        this.#removeListeners.push(callback)
    }
}

/**## ODManagerWithSafety `class`
 * This is an Open Ticket safe manager.
 * 
 * It functions exactly the same as a normal `ODManager`, but it has 1 function extra!
 * The `getSafe()` function will always return data, because when it doesn't find an id, it returns pre-configured backup data.
 */
export class ODManagerWithSafety<DataType extends ODManagerData> extends ODManager<DataType> {
    /**The function that creates backup data returned in `getSafe()` when an id is missing in this manager. */
    #backupCreator: () => DataType
    /** Temporary storage for manager debug name. */
    #debugname: string

    constructor(backupCreator:() => DataType, debug?:ODDebugger, debugname?:string){
        super(debug,debugname)
        this.#backupCreator = backupCreator
        this.#debugname = debugname ?? "unknown"
    }

    /**Get data that matches the `ODId`. Returns the backup data when not found.
     *
     * ### ⚠️ This should only be used when the data doesn't need to be written/edited
    */
    getSafe(id:ODValidId): DataType {
        const data = super.get(id)
        if (!data){
            process.emit("uncaughtException",new ODSystemError("ODManagerWithSafety:getSafe(\""+id+"\") => Unknown Id => Used backup data ("+this.#debugname+" manager)"))
            return this.#backupCreator()
        }
        else return data
    }
}

/**## ODVersionManager `class`
 * A Open Ticket version manager.
 * 
 * It is used to manage different `ODVersion`'s from the bot. You will use it to check which version of the bot is used.
 */
export class ODVersionManager extends ODManager<ODVersion> {
    constructor(){
        super()
    }
}

/**## ODVersion `class`
 * This is an Open Ticket version.
 * 
 * It has many features like comparing versions & checking if they are compatible.
 * 
 * You can use it in your own plugin, but most of the time you will use it to check the Open Ticket version!
 */
export class ODVersion extends ODManagerData {
    /**The first number of the version (example: `v1.2.3` => `1`) */
    primary: number
    /**The second number of the version (example: `v1.2.3` => `2`) */
    secondary: number
    /**The third number of the version (example: `v1.2.3` => `3`) */
    tertiary: number
    
    constructor(id:ODValidId, primary:number, secondary:number, tertiary:number){
        super(id)
        if (typeof primary != "number") throw new ODSystemError("Invalid constructor parameter => primary:number")
        if (typeof secondary != "number") throw new ODSystemError("Invalid constructor parameter => secondary:number")
        if (typeof tertiary != "number") throw new ODSystemError("Invalid constructor parameter => tertiary:number")
        
        this.primary = primary
        this.secondary = secondary
        this.tertiary = tertiary
    }

    /**Get the version from a string (also possible with `v` prefix)
     * @example const version = api.ODVersion.fromString("id","v1.2.3") //creates version 1.2.3
    */
    static fromString(id:ODValidId, version:string){
        if (typeof id != "string" && !(id instanceof ODId)) throw new ODSystemError("Invalid function parameter => id:ODValidId")
        if (typeof version != "string") throw new ODSystemError("Invalid function parameter => version:string")
        
        const versionCheck = (version.startsWith("v")) ? version.substring(1) : version
        const splittedVersion = versionCheck.split(".")

        return new this(id,Number(splittedVersion[0]),Number(splittedVersion[1]),Number(splittedVersion[2]))
    }
    /**Get the version as a string (`noprefix:true` => with `v` prefix)
     * @example
     * new api.ODVersion(1,0,0).toString(false) //returns "v1.0.0"
     * new api.ODVersion(1,0,0).toString(true) //returns "1.0.0"
    */
    toString(noprefix?:boolean){
        const prefix = noprefix ? "" : "v"
        return prefix+[this.primary,this.secondary,this.tertiary].join(".")
    }
    /**Compare this version with another version and returns the result: `higher`, `lower` or `equal`
     * @example
     * new api.ODVersion(1,0,0).compare(new api.ODVersion(1,2,0)) //returns "lower"
     * new api.ODVersion(1,3,0).compare(new api.ODVersion(1,2,0)) //returns "higher"
     * new api.ODVersion(1,2,0).compare(new api.ODVersion(1,2,0)) //returns "equal"
    */
    compare(comparator:ODVersion): "higher"|"lower"|"equal" {
        if (!(comparator instanceof ODVersion)) throw new ODSystemError("Invalid function parameter => comparator:ODVersion")

        if (this.primary < comparator.primary) return "lower"
        else if (this.primary > comparator.primary) return "higher"
        else {
            if (this.secondary < comparator.secondary) return "lower"
            else if (this.secondary > comparator.secondary) return "higher"
            else {
                if (this.tertiary < comparator.tertiary) return "lower"
                else if (this.tertiary > comparator.tertiary) return "higher"
                else return "equal"
            }   
        }
    }
    /**Check if this version is included in the list
     * @example
     * const list = [
     *     new api.ODVersion(1,0,0),
     *     new api.ODVersion(1,0,1),
     *     new api.ODVersion(1,0,2)
     * ]
     * new api.ODVersion(1,0,0).compatible(list) //returns true
     * new api.ODVersion(1,0,1).compatible(list) //returns true
     * new api.ODVersion(1,0,3).compatible(list) //returns false
    */
    compatible(list:ODVersion[]): boolean {
        if (!Array.isArray(list)) throw new ODSystemError("Invalid function parameter => list:ODVersion[]")
        if (!list.every((v) => (v instanceof ODVersion))) throw new ODSystemError("Invalid function parameter => list:ODVersion[]")

        return list.some((v) => {
            return (v.toString() === this.toString())
        })
    }
    /**Check if this version is higher or equal to the provided `requirement`. */
    min(requirement:string|ODVersion){
        if (typeof requirement == "string") requirement = ODVersion.fromString("temp",requirement)
        
        //skip when primary version is higher or lower than current one.
        if (this.primary < requirement.primary) return false
        else if (this.primary > requirement.primary) return true

        //skip when secondary version is higher or lower than current one.
        if (this.secondary < requirement.secondary) return false
        else if (this.secondary > requirement.secondary) return true

        //skip when tertiary version is higher or lower than current one.
        if (this.tertiary < requirement.tertiary) return false
        else if (this.tertiary > requirement.tertiary) return true
        
        return true
    }
    /**Check if this version is lower or equal to the provided `requirement`. */
    max(requirement:string|ODVersion){
        if (typeof requirement == "string") requirement = ODVersion.fromString("temp",requirement)
        
        //skip when primary version is higher or lower than current one.
        if (this.primary < requirement.primary) return true
        else if (this.primary > requirement.primary) return false

        //skip when secondary version is higher or lower than current one.
        if (this.secondary < requirement.secondary) return true
        else if (this.secondary > requirement.secondary) return false

        //skip when tertiary version is higher or lower than current one.
        if (this.tertiary < requirement.tertiary) return true
        else if (this.tertiary > requirement.tertiary) return false
        
        return true
    }
    /**Check if this version is matches the major version (`vX.X`) of the provided `requirement`. */
    major(requirement:string|ODVersion){
        if (typeof requirement == "string") requirement = ODVersion.fromString("temp",requirement)
        return (this.primary == requirement.primary && this.secondary == requirement.secondary)
    }
    /**Check if this version is matches the minor version (`vX.X.X`) of the provided `requirement`. */
    minor(requirement:string|ODVersion){
        if (typeof requirement == "string") requirement = ODVersion.fromString("temp",requirement)
        return (this.primary == requirement.primary && this.secondary == requirement.secondary && this.tertiary == requirement.tertiary)
    }
}

/**## ODHTTPGetRequest `class`
 * This is a class that can help you with creating simple HTTP GET requests.
 * 
 * It works using the native node.js fetch() method. You can configure all options in the constructor!
 * @example
 * const request = new api.ODHTTPGetRequest("https://www.example.com/abc.txt",false,{})
 * 
 * const result = await request.run()
 * result.body //the response body (string)
 * result.status //the response code (number)
 * result.response //the full response (object)
 */
export class ODHTTPGetRequest {
    /**The url used in the request */
    url: string
    /**The request config for additional options */
    config: RequestInit
    /**Throw on error OR return http code 500 */
    throwOnError: boolean

    constructor(url:string,throwOnError:boolean,config?:RequestInit){
        if (typeof url != "string") throw new ODSystemError("Invalid constructor parameter => url:string")
        if (typeof throwOnError != "boolean") throw new ODSystemError("Invalid constructor parameter => throwOnError:boolean")
        if (typeof config != "undefined" && typeof config != "object") throw new ODSystemError("Invalid constructor parameter => config?:RequestInit")

        this.url = url
        this.throwOnError = throwOnError
        const newConfig = config ?? {}
        newConfig.method = "GET"
        if (newConfig.headers) Object.assign(newConfig.headers,{"User-Agent":"OpenDiscordBots-OpenTicket/4.1.1"})
        else newConfig.headers = {"User-Agent":"OpenDiscordBots-OpenTicket/4.1.1"}
        this.config = newConfig
    }

    /**Execute the GET request.*/
    run(): Promise<{status:number, body:string, response?:Response}> {
        return new Promise(async (resolve,reject) => {
            try{
                const response = await fetch(this.url,this.config)
                resolve({
                    status:response.status,
                    body:(await response.text()),
                    response:response
                })
            }catch(err){
                if (this.throwOnError) return reject("[OPENTICKET ERROR]: ODHTTPGetRequest => Unknown fetch() error: "+err)
                else return resolve({
                    status:500,
                    body:"Open Ticket Error: Unknown fetch() error: "+err,
                })
            }
        })
    }
}

/**## ODHTTPPostRequest `class`
 * This is a class that can help you with creating simple HTTP POST requests.
 * 
 * It works using the native node.js fetch() method. You can configure all options in the constructor!
 * @example
 * const request = new api.ODHTTPPostRequest("https://www.example.com/abc.txt",false,{})
 * 
 * const result = await request.run()
 * result.body //the response body (string)
 * result.status //the response code (number)
 * result.response //the full response (object)
 */
export class ODHTTPPostRequest {
    /**The url used in the request */
    url: string
    /**The request config for additional options */
    config: RequestInit
    /**Throw on error OR return http code 500 */
    throwOnError: boolean

    constructor(url:string,throwOnError:boolean,config?:RequestInit){
        if (typeof url != "string") throw new ODSystemError("Invalid constructor parameter => url:string")
        if (typeof throwOnError != "boolean") throw new ODSystemError("Invalid constructor parameter => throwOnError:boolean")
        if (typeof config != "undefined" && typeof config != "object") throw new ODSystemError("Invalid constructor parameter => config?:RequestInit")
                
        this.url = url
        this.throwOnError = throwOnError
        const newConfig = config ?? {}
        newConfig.method = "POST"
        if (newConfig.headers) Object.assign(newConfig.headers,{"User-Agent":"OpenDiscordBots-OpenTicket/4.1.1"})
        else newConfig.headers = {"User-Agent":"OpenDiscordBots-OpenTicket/4.1.1"}
        this.config = newConfig
    }

    /**Execute the POST request.*/
    run(): Promise<{status:number, body:string, response?:Response}> {
        return new Promise(async (resolve,reject) => {
            try{
                const response = await fetch(this.url,this.config)
                resolve({
                    status:response.status,
                    body:(await response.text()),
                    response:response
                })
            }catch(err){
                if (this.throwOnError) return reject("[OPENTICKET ERROR]: ODHTTPPostRequest => Unknown fetch() error: "+err)
                else return resolve({
                    status:500,
                    body:"Open Ticket Error: Unknown fetch() error!",
                })
            }
        })
    }
}

/**## ODEnvHelper `class`
 * This is a utility class that helps you with reading the ENV.
 * 
 * It has support for the built-in `process.env` & `.env` file
 * @example
 * const envHelper = new api.ODEnvHelper()
 * 
 * const variableA = envHelper.getVariable("value-a")
 * const variableB = envHelper.getVariable("value-b","dotenv") //only get from .env
 * const variableA = envHelper.getVariable("value-c","env") //only get from process.env
 */
export class ODEnvHelper {
    /**All variables found in the `.env` file */
    dotenv: object
    /**All variables found in `process.env` */
    env: object

    constructor(customEnvPath?:string){
        if (typeof customEnvPath != "undefined" && typeof customEnvPath != "string") throw new ODSystemError("Invalid constructor parameter => customEnvPath?:string")
    
        const path = customEnvPath ? customEnvPath : ".env"
        this.dotenv = fs.existsSync(path) ? this.#readDotEnv(fs.readFileSync(path)) : {}
        this.env = process.env
    }

    /**Get a variable from the env */
    getVariable(name:string,source?:"dotenv"|"env"): any|undefined {
        if (typeof name != "string") throw new ODSystemError("Invalid function parameter => name:string")
        if ((typeof source != "undefined" && typeof source != "string") || (source && !["env","dotenv"].includes(source))) throw new ODSystemError("Invalid function parameter => source:'dotenv'|'env'")

        if (source == "dotenv"){
            return this.dotenv[name]
        }else if (source == "env"){
            return this.env[name]
        }else{
            //when no source specified => .env has priority over process.env
            if (this.dotenv[name]) return this.dotenv[name]
            else return this.env[name]
        }
    }

    //THIS CODE IS COPIED FROM THE DODENV-LIB
    //Repo: https://github.com/motdotla/dotenv
    //Source: https://github.com/motdotla/dotenv/blob/master/lib/main.js#L12
    #readDotEnv(src:Buffer){
        const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg
        const obj = {}
        
        // Convert buffer to string
        let lines = src.toString()
        
        // Convert line breaks to same format
        lines = lines.replace(/\r\n?/mg, '\n')
        
        let match
        while ((match = LINE.exec(lines)) != null) {
            const key = match[1]
        
            // Default undefined or null to empty string
            let value = (match[2] || '')
        
            // Remove whitespace
            value = value.trim()
        
            // Check if double quoted
            const maybeQuote = value[0]
        
            // Remove surrounding quotes
            value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')
        
            // Expand newlines if double quoted
            if (maybeQuote === '"') {
            value = value.replace(/\\n/g, '\n')
            value = value.replace(/\\r/g, '\r')
            }
        
            // Add to object
            obj[key] = value
        }
        return obj
    }
}

/**## ODSystemError `class`
 * A wrapper for the node.js `Error` class that makes the error look better in the console!
 * 
 * This wrapper is made for Open Ticket system errors! **It can only be used by Open Ticket itself!**
 */
export class ODSystemError extends Error {
    /**This variable gets detected by the error handling system to know how to render it */
    _ODErrorType = "system"

    /**Create an `ODSystemError` directly from an `Error` class */
    static fromError(err:Error){
        err["_ODErrorType"] = "system"
        return err as ODSystemError
    }
}

/**## ODPluginError `class`
 * A wrapper for the node.js `Error` class that makes the error look better in the console!
 * 
 * This wrapper is made for Open Ticket plugin errors! **It can only be used by plugins!**
 */
export class ODPluginError extends Error {
    /**This variable gets detected by the error handling system to know how to render it */
    _ODErrorType = "plugin"

    /**Create an `ODPluginError` directly from an `Error` class */
    static fromError(err:Error){
        err["_ODErrorType"] = "plugin"
        return err as ODPluginError
    }
}

/**Oh, what could this be `¯\_(ツ)_/¯` */
export interface ODEasterEggs {
    creator:string,
    translators:string[]
}