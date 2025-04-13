///////////////////////////////////////
//CONFIG MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODPromiseVoid, ODSystemError, ODValidId } from "./base"
import nodepath from "path"
import { ODDebugger } from "./console"
import fs from "fs"
import * as fjs from "formatted-json-stringify"

/**## ODConfigManager `class`
 * This is an Open Ticket config manager.
 * 
 * It manages all config files in the bot and allows plugins to access config files from Open Ticket & other plugins!
 * 
 * You can use this class to get/change/add a config file (`ODConfig`) in your plugin!
 */
export class ODConfigManager extends ODManager<ODConfig> {
    /**Alias to Open Ticket debugger. */
    #debug: ODDebugger
    
    constructor(debug:ODDebugger){
        super(debug,"config")
        this.#debug = debug
    }
    add(data:ODConfig|ODConfig[],overwrite?:boolean): boolean {
        if (Array.isArray(data)) data.forEach((d) => d.useDebug(this.#debug))
        else data.useDebug(this.#debug)
        return super.add(data,overwrite)
    }
    /**Init all config files. */
    async init(){
        for (const config of this.getAll()){
            try{
                await config.init()
            }catch(err){
                process.emit("uncaughtException",new ODSystemError(err))
            }
        }
    }
}

/**## ODConfig `class`
 * This is an Open Ticket config helper.
 * This class doesn't do anything at all, it just gives a template & basic methods for a config. Use `ODJsonConfig` instead!
 * 
 * You can use this class if you want to create your own config implementation (e.g. `yml`, `xml`,...)!
 */
export class ODConfig extends ODManagerData {
    /**The name of the file with extension. */
    file: string = ""
    /**The path to the file relative to the main directory. */
    path: string = ""
    /**An object/array of the entire config file! Variables inside it can be edited while the bot is running! */
    data: any
    /**Is this config already initiated? */
    initiated: boolean = false
    /**An array of listeners to run when the config gets reloaded. These are not executed on the initial loading. */
    protected reloadListeners: Function[] = []
    /**Alias to Open Ticket debugger. */
    protected debug: ODDebugger|null = null

    constructor(id:ODValidId, data:any){
        super(id)
        this.data = data
    }

    /**Use the Open Ticket debugger for logs. */
    useDebug(debug:ODDebugger|null){
        this.debug = debug
    }
    /**Init the config. */
    init(): ODPromiseVoid {
        this.initiated = true
        if (this.debug) this.debug.debug("Initiated config '"+this.file+"' in ODConfigManager.",[{key:"id",value:this.id.value}])
        //please implement this feature in your own config extension & extend this function.
    }
    /**Reload the config. Be aware that this doesn't update the config data everywhere in the bot! */
    reload(): ODPromiseVoid {
        if (this.debug) this.debug.debug("Reloaded config '"+this.file+"' in ODConfigManager.",[{key:"id",value:this.id.value}])
        //please implement this feature in your own config extension & extend this function.
    }
    /**Save the edited config to the filesystem. This is used by the Interactive Setup CLI. It's not recommended to use this while the bot is running. */
    save(): ODPromiseVoid {
        if (this.debug) this.debug.debug("Saved config '"+this.file+"' in ODConfigManager.",[{key:"id",value:this.id.value}])
        //please implement this feature in your own config extension & extend this function.
    }
    /**Listen for a reload of this JSON file! */
    onReload(cb:Function){
        this.reloadListeners.push(cb)
    }
    /**Remove all reload listeners. Not recommended! */
    removeAllReloadListeners(){
        this.reloadListeners = []
    }
}

/**## ODJsonConfig `class`
 * This is an Open Ticket JSON config.
 * You can use this class to get & edit variables from the config files or to create your own JSON config!
 * @example
 * //create a config from: ./config/test.json with the id "some-config"
 * const config = new api.ODJsonConfig("some-config","test.json")
 * 
 * //create a config with custom dir: ./plugins/testplugin/test.json
 * const config = new api.ODJsonConfig("plugin-config","test.json","./plugins/testplugin/")
 */
export class ODJsonConfig extends ODConfig {
    formatter: fjs.custom.BaseFormatter

    constructor(id:ODValidId, file:string, customPath?:string, formatter?:fjs.custom.BaseFormatter){
        super(id,{})
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./config/",this.file)
        this.formatter = formatter ?? new fjs.DefaultFormatter(null,true,"    ")
    }

    /**Init the config. */
    init(): ODPromiseVoid {
        if (!fs.existsSync(this.path)) throw new ODSystemError("Unable to parse config \""+nodepath.join("./",this.path)+"\", the file doesn't exist!")
        try{
            this.data = JSON.parse(fs.readFileSync(this.path).toString())
            super.init()
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Unable to parse config \""+nodepath.join("./",this.path)+"\"!")
        }
    }
    /**Reload the config. Be aware that this doesn't update the config data everywhere in the bot! */
    reload(){
        if (!this.initiated) throw new ODSystemError("Unable to reload config \""+nodepath.join("./",this.path)+"\", the file hasn't been initiated yet!")
        if (!fs.existsSync(this.path)) throw new ODSystemError("Unable to reload config \""+nodepath.join("./",this.path)+"\", the file doesn't exist!")
        try{
            this.data = JSON.parse(fs.readFileSync(this.path).toString())
            super.reload()
            this.reloadListeners.forEach((cb) => {
                try{
                    cb()
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            })
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Unable to reload config \""+nodepath.join("./",this.path)+"\"!")
        }
    }
    /**Save the edited config to the filesystem. This is used by the Interactive Setup CLI. It's not recommended to use this while the bot is running. */
    save(): ODPromiseVoid {
        if (!this.initiated) throw new ODSystemError("Unable to save config \""+nodepath.join("./",this.path)+"\", the file hasn't been initiated yet!")
        try{
            const contents = this.formatter.stringify(this.data)
            fs.writeFileSync(this.path,contents)
            super.save()
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Unable to save config \""+nodepath.join("./",this.path)+"\"!")
        }
    }
}