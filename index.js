/////////////// STARTUP FLAGS ///////////////
const flags = [
    // Edit flags here when being unable to use the flags in the command prompt.
    //PTERODACTYL PANEL
    //add startup flags here (e.g. "--no-compile") when running via the panel
]
process.argv.push(...flags)
/////////////// STARTUP FLAGS ///////////////

/*
 ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  
██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  
██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     
██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     
╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     
 v4.1.3 - Made by DJj123dj & Contributors

 Discord: https://discord.dj-dj.be
 Docs: https://otdocs.dj-dj.be
 Support Us: https://github.com/sponsors/DJj123dj/
 
 */
///////////////////////////////////////////
////////// COMPILATION + STARTUP //////////
///////////////////////////////////////////
const fs = require("fs")
const ts = require("typescript")
const {createHash,Hash} = require("crypto")
const nodepath = require('path')
const ansis = require("ansis")

/** ## What is this?
 * This is a function which compares `./src/` with a hash stored in `./dist/hash.txt`.
 * The hash is based on the modified date & file metadata of all files in `./src/`.
 * 
 * If the hash is different, the bot will automatically re-compile.
 * This will help you save CPU resources because the bot shouldn't re-compile when nothing has been changed :)
 * 
 * @param {string} dir
 * @param {Hash|null} upperHash
 */
function computeSourceHash(dir,upperHash){
    const hash = upperHash ? upperHash : createHash("sha256")
    const info = fs.readdirSync(dir,{withFileTypes:true})
    
    for (const file of info) {
        const fullPath = nodepath.join(dir,file.name)
        if (file.isFile() && [".js",".ts",".jsx",".tsx"].some((ext) => file.name.endsWith(ext))){
            const statInfo = fs.statSync(fullPath)
            //compute hash using file metadata
            const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`
            hash.update(fileInfo)
            
        }else if (file.isDirectory()){
            //recursively compute all folders
            computeSourceHash(fullPath,hash)
        }
    }
    //return when not being called recursively
    if (!upperHash) {
        return hash.digest("hex")
    }
}
function requiresCompilation(){
    //check hashes when not using "--compile-only" flag
    if (process.argv.includes("--compile-only")) return true

    console.log("OT: Comparing prebuilds with source...")
    const sourceHash = computeSourceHash("./src/")
    const pluginHash = computeSourceHash("./plugins/")
    const hash = sourceHash+":"+pluginHash

    if (fs.existsSync("./dist/hash.txt")){
        const distHash = fs.readFileSync("./dist/hash.txt").toString()
        if (distHash === hash) return false
        else return true
    }else return true
}
function saveNewCompilationHash(){
    const sourceHash = computeSourceHash("./src/")
    const pluginHash = computeSourceHash("./plugins/")
    const hash = sourceHash+":"+pluginHash
    fs.writeFileSync("./dist/hash.txt",hash)
}

if (!process.argv.includes("--no-compile")){
    const requiredDependencies = new Set()
    if (fs.existsSync("./plugins")){
        console.log("OT: Reading plugin.json files...")
        for (const pluginDir of fs.readdirSync("./plugins")){
            if (pluginDir === ".DS_Store") continue
            const pluginPath = nodepath.join("./plugins", pluginDir)
            if (!fs.statSync(pluginPath).isDirectory()) continue
            
            const pluginJsonPath = nodepath.join(pluginPath, "plugin.json")
            if (fs.existsSync(pluginJsonPath)){
                try{
                    const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath).toString())
                    if (pluginData.npmDependencies && Array.isArray(pluginData.npmDependencies)){
                        pluginData.npmDependencies.forEach((dep) => {
                            if (typeof dep === "string" && dep.trim()){
                                requiredDependencies.add(dep.trim())
                            }
                        })
                    }
                }catch(err){
                    // skip invalid plugin.json files, will be caught later
                }
            }
        }
        
        if (requiredDependencies.size > 0){
            console.log("OT: Checking plugin npm dependencies...")
            /**@type {string[]} */
            const missingDeps = []
            for (const dep of requiredDependencies){
                try{
                    require.resolve(dep)
                }catch(err){
                    missingDeps.push(dep)
                }
            }
            
            if (missingDeps.length > 0){
                console.log(ansis.red("OT: ❌ Fatal Error --> Missing npm dependencies required by plugins:\n\n")+ansis.cyan(missingDeps.map((dep) => "  - "+dep).join("\n")+"\n"))
                console.log("OT: Please install missing dependencies using the following command:\n> "+ansis.bold.green("npm install " + missingDeps.join(" "))+"\n")
                process.exit(1)
            }
        }
    }
    
    if (requiresCompilation()){
        console.log("OT: Compilation Required...")

        //REMOVE EXISTING BUILDS
        console.log("OT: Removing Prebuilds...")
        fs.rmSync("./dist",{recursive:true,force:true})

        //COMPILE TYPESCRIPT
        console.log("OT: Compiling Typescript...")
        const configPath = nodepath.resolve('./tsconfig.json')
        const configFile = ts.readConfigFile(configPath,ts.sys.readFile)

        //check for tsconfig errors
        if (configFile.error){
            const message = ts.formatDiagnosticsWithColorAndContext([configFile.error],ts.createCompilerHost({}))
            console.error(message)
            process.exit(1)
        }

        //parse tsconfig file
        const parsedConfig = ts.parseJsonConfigFileContent(configFile.config,ts.sys,nodepath.dirname(configPath))

        //create program/compiler
        const program = ts.createProgram({
            rootNames:parsedConfig.fileNames,
            options:parsedConfig.options
        })

        //emit all compiled files
        const emitResult = program.emit()

        //print emit errors/warnings (type errors)
        const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
        const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(allDiagnostics, ts.createCompilerHost(parsedConfig.options))
        console.log(formattedDiagnostics)

        if (emitResult.emitSkipped || allDiagnostics.find((d) => d.category == ts.DiagnosticCategory.Error || d.category == ts.DiagnosticCategory.Warning)){
            console.log("OT: Compilation Failed!")
            process.exit(1)
        }
    }else console.log("OT: No Compilation Required...")

    //save new compilation hash
    saveNewCompilationHash()
}

//START BOT
console.log("OT: Compilation Succeeded!")
if (process.argv.includes("--compile-only")) process.exit(0) //exit when only compile is required!
console.log("OT: Starting Bot!")
require("./dist/src/index.js")