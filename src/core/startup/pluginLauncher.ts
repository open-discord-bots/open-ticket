import {opendiscord, api, utilities} from "../../index"
import fs from "fs"
import { ODPluginError } from "../api/api"

export const loadAllPlugins = async () => {
    //start launching plugins
    opendiscord.log("Loading plugins...","system")
    let initPluginError: boolean = false

    if (!fs.existsSync("./plugins")){
        opendiscord.log("Couldn't find ./plugins directory, canceling all plugin execution!","error")
        return
    }
    const plugins = fs.readdirSync("./plugins")

    //check & validate
    plugins.forEach((p) => {
        //prechecks
        if (p === ".DS_Store") return //ignore MacOS DS_Store file
        if (!fs.statSync("./plugins/"+p).isDirectory()) return opendiscord.log("Plugin is not a directory, canceling plugin execution...","plugin",[
            {key:"plugin",value:"./plugins/"+p}
        ])
        if (!fs.existsSync("./plugins/"+p+"/plugin.json")){
            initPluginError = true
            opendiscord.log("Plugin doesn't have a plugin.json, canceling plugin execution...","plugin",[
                {key:"plugin",value:"./plugins/"+p}
            ])
            return
        }

        //plugin loading
        try {
            const rawplugindata: api.ODPluginData = JSON.parse(fs.readFileSync("./plugins/"+p+"/plugin.json").toString())

            if (typeof rawplugindata != "object") throw new ODPluginError("Failed to load plugin.json")
            if (typeof rawplugindata.id != "string") throw new ODPluginError("Failed to load plugin.json/id")
            if (typeof rawplugindata.name != "string") throw new ODPluginError("Failed to load plugin.json/name")
            if (typeof rawplugindata.version != "string") throw new ODPluginError("Failed to load plugin.json/version")
            if (typeof rawplugindata.startFile != "string") throw new ODPluginError("Failed to load plugin.json/startFile")
            
            if (typeof rawplugindata.enabled != "boolean") throw new ODPluginError("Failed to load plugin.json/enabled")
            if (typeof rawplugindata.priority != "number") throw new ODPluginError("Failed to load plugin.json/priority")
            if (!Array.isArray(rawplugindata.events)) throw new ODPluginError("Failed to load plugin.json/events")
            
            if (!Array.isArray(rawplugindata.npmDependencies)) throw new ODPluginError("Failed to load plugin.json/npmDependencies")
            if (!Array.isArray(rawplugindata.requiredPlugins)) throw new ODPluginError("Failed to load plugin.json/requiredPlugins")
            if (!Array.isArray(rawplugindata.incompatiblePlugins)) throw new ODPluginError("Failed to load plugin.json/incompatiblePlugins")
            
            if (typeof rawplugindata.details != "object") throw new ODPluginError("Failed to load plugin.json/details")
            
            // Handle author field - support both old (string) and new (array) format for backwards compatibility
            if (typeof rawplugindata.details.author != "string" && !Array.isArray(rawplugindata.details.author)) {
                throw new ODPluginError("Failed to load plugin.json/details/author (must be string or array)")
            }
            
            // Normalize author to array format for internal use
            if (typeof rawplugindata.details.author == "string") {
                // Old format: convert string to array
                rawplugindata.details.authors = [rawplugindata.details.author]
            } else if (Array.isArray(rawplugindata.details.author)) {
                // New format: use author array as authors
                rawplugindata.details.authors = rawplugindata.details.author
            }
            
            // Validate authors array if provided separately
            if (rawplugindata.details.authors && !Array.isArray(rawplugindata.details.authors)) {
                throw new ODPluginError("Failed to load plugin.json/details/authors (must be array)")
            }
            
            // Validate contributors array if provided
            if (rawplugindata.details.contributors && !Array.isArray(rawplugindata.details.contributors)) {
                throw new ODPluginError("Failed to load plugin.json/details/contributors (must be array)")
            }
            
            // Validate versions array if provided
            if (rawplugindata.details.versions) {
                if (!Array.isArray(rawplugindata.details.versions)) {
                    throw new ODPluginError("Failed to load plugin.json/details/versions (must be array)")
                }
                // Validate version format: should match pattern like "OTv4.0.x", "ODv1.0.0", etc.
                for (const version of rawplugindata.details.versions) {
                    if (typeof version != "string") {
                        throw new ODPluginError("Failed to load plugin.json/details/versions (all items must be strings)")
                    }
                    // Check format: project prefix (OT, OD, OM, OU) + v + version pattern
                    const versionPattern = /^(OT|OD|OM|OU)v\d+\.\d+(\.\d+|\.x)$/
                    if (!versionPattern.test(version)) {
                        throw new ODPluginError(`Failed to load plugin.json/details/versions (invalid format: "${version}", expected format like "OTv4.0.x" or "ODv1.0.0")`)
                    }
                }
            }
            
            if (typeof rawplugindata.details.shortDescription != "string") throw new ODPluginError("Failed to load plugin.json/details/shortDescription")
            if (typeof rawplugindata.details.longDescription != "string") throw new ODPluginError("Failed to load plugin.json/details/longDescription")
            if (typeof rawplugindata.details.imageUrl != "string") throw new ODPluginError("Failed to load plugin.json/details/imageUrl")
            if (typeof rawplugindata.details.projectUrl != "string") throw new ODPluginError("Failed to load plugin.json/details/projectUrl")
            if (!Array.isArray(rawplugindata.details.tags)) throw new ODPluginError("Failed to load plugin.json/details/tags")
            
            if (rawplugindata.id != p) throw new ODPluginError("Failed to load plugin, directory name is required to match the id")
            
            if (opendiscord.plugins.exists(rawplugindata.id)) throw new ODPluginError("Failed to load plugin, this id already exists in another plugin")

            //plugin.json is valid => load plugin
            const plugin = new api.ODPlugin(p,rawplugindata)
            opendiscord.plugins.add(plugin)

        }catch(e){
            //when any of the above errors happen, crash the bot when soft mode isn't enabled
            initPluginError = true
            opendiscord.log(e.message+", canceling plugin execution...","plugin",[
                {key:"path",value:"./plugins/"+p}
            ])
            opendiscord.log("You can see more about this error in the ./otdebug.txt file!","info")
            opendiscord.debugfile.writeText(e.stack)
            
            //try to get some crashed plugin data
            try{
                const rawplugindata: api.ODPluginData = JSON.parse(fs.readFileSync("./plugins/"+p+"/plugin.json").toString())
                opendiscord.plugins.unknownCrashedPlugins.push({
                    name:rawplugindata.name ?? "./plugins/"+p,
                    description:(rawplugindata.details && rawplugindata.details.shortDescription) ? rawplugindata.details.shortDescription : "This plugin crashed :(",
                })
            }catch{}
        }
    })

    //sorted plugins (sorted on priority. All plugins are loaded & enabled)
    const sortedPlugins = opendiscord.plugins.getAll().sort((a,b) => {
        return (b.priority - a.priority)
    })

    //check for incompatible & missing plugins/dependencies
    const incompatibilities: {from:string,to:string}[] = []
    const missingDependencies: {id:string,missing:string}[] = []
    const missingPlugins: {id:string,missing:string}[] = []
    const versionIncompatibilities: {id:string}[] = []

    //go through all plugins for errors
    sortedPlugins.filter((plugin) => plugin.enabled).forEach((plugin) => {
        const from = plugin.id.value
        plugin.dependenciesInstalled().forEach((missing) => missingDependencies.push({id:from,missing}))
        plugin.pluginsIncompatible(opendiscord.plugins).forEach((incompatible) => incompatibilities.push({from,to:incompatible}))
        plugin.pluginsInstalled(opendiscord.plugins).forEach((missing) => missingPlugins.push({id:from,missing}))
        
        // Check version compatibility
        if (plugin.data.details.versions && plugin.data.details.versions.length > 0) {
            const currentVersion = opendiscord.versions.get("opendiscord:version")
            let isCompatible = false
            
            for (const versionStr of plugin.data.details.versions) {
                // Parse version string (e.g., "OTv4.0.x" or "OTv4.1.2")
                const match = versionStr.match(/^(OT|OD|OM|OU)v(\d+)\.(\d+)(?:\.(\d+|x))$/)
                if (!match) continue
                
                const projectPrefix = match[1]
                const primary = parseInt(match[2])
                const secondary = parseInt(match[3])
                const tertiary = match[4]
                
                // Only check OT (Open Ticket) versions for now
                if (projectPrefix !== "OT") continue
                
                // Check if version matches
                if (tertiary === "x") {
                    // Wildcard version (e.g., "OTv4.0.x" matches 4.0.0, 4.0.1, etc.)
                    if (currentVersion.primary === primary && currentVersion.secondary === secondary) {
                        isCompatible = true
                        break
                    }
                } else {
                    // Exact version (e.g., "OTv4.0.0")
                    const requiredVersion = api.ODVersion.fromString("temp", `v${primary}.${secondary}.${parseInt(tertiary)}`)
                    if (currentVersion.primary === requiredVersion.primary && 
                        currentVersion.secondary === requiredVersion.secondary && 
                        currentVersion.tertiary === requiredVersion.tertiary) {
                        isCompatible = true
                        break
                    }
                }
            }
            
            if (!isCompatible) {
                versionIncompatibilities.push({id:from})
            }
        }
    })

    //handle all incompatibilities
    const alreadyLoggedCompatPlugins: string[] = []
    incompatibilities.forEach((match) => {
        if (alreadyLoggedCompatPlugins.includes(match.from) || alreadyLoggedCompatPlugins.includes(match.to)) return
        else alreadyLoggedCompatPlugins.push(match.from,match.to)

        const fromPlugin = opendiscord.plugins.get(match.from)
        if (fromPlugin && !fromPlugin.crashed){
            fromPlugin.crashed = true
            fromPlugin.crashReason = "incompatible.plugin"
        }
        const toPlugin = opendiscord.plugins.get(match.to)
        if (toPlugin && !toPlugin.crashed){
            toPlugin.crashed = true
            toPlugin.crashReason = "incompatible.plugin"
        }

        opendiscord.log(`Incompatible plugins => "${match.from}" & "${match.to}", canceling plugin execution...`,"plugin",[
            {key:"path1",value:"./plugins/"+match.from},
            {key:"path2",value:"./plugins/"+match.to}
        ])
        initPluginError = true
    })

    //handle all missing dependencies
    missingDependencies.forEach((match) => {
        const plugin = opendiscord.plugins.get(match.id)
        if (plugin && !plugin.crashed){
            plugin.crashed = true
            plugin.crashReason = "missing.dependency"
        }

        opendiscord.log(`Missing npm dependency "${match.missing}", canceling plugin execution...`,"plugin",[
            {key:"path",value:"./plugins/"+match.id}
        ])
        initPluginError = true
    })

    //handle all missing plugins
    missingPlugins.forEach((match) => {
        const plugin = opendiscord.plugins.get(match.id)
        if (plugin && !plugin.crashed){
            plugin.crashed = true
            plugin.crashReason = "missing.plugin"
        }

        opendiscord.log(`Missing required plugin "${match.missing}", canceling plugin execution...`,"plugin",[
            {key:"path",value:"./plugins/"+match.id}
        ])
        initPluginError = true
    })

    //handle all version incompatibilities
    versionIncompatibilities.forEach((match) => {
        const plugin = opendiscord.plugins.get(match.id)
        if (plugin && !plugin.crashed){
            plugin.crashed = true
            plugin.crashReason = "missing.dependency" // Reuse this reason for version incompatibility
        }

        const versions = plugin?.data.details.versions?.join(", ") ?? "unknown"
        const currentVersion = opendiscord.versions.get("opendiscord:version").toString()
        opendiscord.log(`Plugin version incompatibility: plugin requires "${versions}" but current version is "${currentVersion}", canceling plugin execution...`,"plugin",[
            {key:"path",value:"./plugins/"+match.id}
        ])
        initPluginError = true
    })

    //exit on error (when soft mode disabled)
    if (!opendiscord.defaults.getDefault("softPluginLoading") && initPluginError){
        console.log("")
        opendiscord.log("Please fix all plugin errors above & try again!","error")
        process.exit(1)
    }

    //preload all events required for every plugin
    for (const plugin of sortedPlugins){
        if (plugin.enabled) plugin.data.events.forEach((event) => opendiscord.events.add(new api.ODEvent(event)))
    }
    
    //execute all working plugins
    for (const plugin of sortedPlugins){
        const status = await plugin.execute(opendiscord.debug,false)
        
        //exit on error (when soft mode disabled)
        if (!status && !opendiscord.defaults.getDefault("softPluginLoading")){
            console.log("")
            opendiscord.log("Please fix all plugin errors above & try again!","error")
            process.exit(1)
        }
    }

    for (const plugin of sortedPlugins){
        // Get authors list (normalized to array)
        const authors = (Array.isArray(plugin.details.author) ? plugin.details.author : 
                        (plugin.details.authors || [plugin.details.author as string])).join(", ")
        
        if (plugin.enabled){
            opendiscord.debug.debug("Plugin \""+plugin.id.value+"\" loaded",[
                {key:"status",value:(plugin.crashed ? "crashed" : "success")},
                {key:"crashReason",value:(plugin.crashed ? (plugin.crashReason ?? "/") : "/")},
                {key:"author",value:authors},
                {key:"version",value:plugin.version.toString()},
                {key:"priority",value:plugin.priority.toString()}
            ])
        }else{
            opendiscord.debug.debug("Plugin \""+plugin.id.value+"\" disabled",[
                {key:"author",value:authors},
                {key:"version",value:plugin.version.toString()},
                {key:"priority",value:plugin.priority.toString()}
            ])
        }
    }
}