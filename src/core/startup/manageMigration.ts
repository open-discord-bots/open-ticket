import {opendiscord, api, utilities} from "../../index"
import fs from "fs"

/**Check if migration is required. Returns the last version used in the database. */
async function isMigrationRequired(): Promise<false|api.ODVersion> {
    const rawVersion = await opendiscord.databases.get("opendiscord:global").get("opendiscord:last-version","opendiscord:version")
    if (!rawVersion) return false
    const version = api.ODVersion.fromString("opendiscord:last-version",rawVersion)
    if (opendiscord.versions.get("opendiscord:version").compare(version) == "higher"){
        return version
    }else return false
}

/**Save all versions in `opendiscord.versions` to the global database. */
async function saveAllVersionsToDatabase(){
    const globalDatabase = opendiscord.databases.get("opendiscord:global")

    await opendiscord.versions.loopAll(async (version,id) => {
        await globalDatabase.set("opendiscord:last-version",id.value,version.toString())    
    })
}

export const loadVersionMigrationSystem = async () => {
    //ENTER MIGRATION CONTEXT
    await preloadMigrationContext()

    const lastVersion = await isMigrationRequired()

    //save last version to database (OR set to current version if no migration is required)
    opendiscord.versions.add(lastVersion ? lastVersion : api.ODVersion.fromString("opendiscord:last-version",opendiscord.versions.get("opendiscord:version").toString()))
    
    if (lastVersion && !opendiscord.flags.get("opendiscord:no-migration").value){
        //MIGRATION IS REQUIRED
        opendiscord.log("Detected old data!","info")
        opendiscord.log("Starting closed API context...","debug")
        await utilities.timer(600)
        opendiscord.log("Migrating data to new version...","debug")
        await loadAllVersionMigrations(lastVersion)
        opendiscord.log("Stopping closed API context...","debug")
        await utilities.timer(400)
        opendiscord.log("All data is now up to date!","info")
        await utilities.timer(200)
        console.log("---------------------------------------------------------------------")
    }
    saveAllVersionsToDatabase()

    //DEFAULT FLAGS
    if (opendiscord.flags.exists("opendiscord:no-plugins") && opendiscord.flags.get("opendiscord:no-plugins").value) opendiscord.defaults.setDefault("pluginLoading",false)
    if (opendiscord.flags.exists("opendiscord:soft-plugins") && opendiscord.flags.get("opendiscord:soft-plugins").value) opendiscord.defaults.setDefault("softPluginLoading",true)
    if (opendiscord.flags.exists("opendiscord:crash") && opendiscord.flags.get("opendiscord:crash").value) opendiscord.defaults.setDefault("crashOnError",true)
    if (opendiscord.flags.exists("opendiscord:force-slash-update") && opendiscord.flags.get("opendiscord:force-slash-update").value){
        opendiscord.defaults.setDefault("forceSlashCommandRegistration",true)
        opendiscord.defaults.setDefault("forceContextMenuRegistration",true)
    }
    if (opendiscord.flags.exists("opendiscord:silent") && opendiscord.flags.get("opendiscord:silent").value) opendiscord.console.silent = true
    

    //LEAVE MIGRATION CONTEXT
    await unloadMigrationContext()

    return lastVersion
}

/**Initialize the migration context by loading the built-in flags, configs & databases. */
async function preloadMigrationContext(){
    opendiscord.debug.debug("-- MIGRATION CONTEXT START --")
    await (await import("../../data/framework/flagLoader.js")).loadAllFlags()
    await opendiscord.flags.init()
    await (await import("../../data/framework/configLoader.js")).loadAllConfigs()
    await opendiscord.configs.init()
    await (await import("../../data/framework/databaseLoader.js")).loadAllDatabases()
    await opendiscord.databases.init()
    opendiscord.debug.visible = true
}

/**Unload the migration context to start the bot normally. */
async function unloadMigrationContext(){
    opendiscord.debug.visible = false
    await opendiscord.databases.loopAll((database,id) => {opendiscord.databases.remove(id)})
    await opendiscord.configs.loopAll((config,id) => {opendiscord.configs.remove(id)})
    await opendiscord.flags.loopAll((flag,id) => {opendiscord.flags.remove(id)})
    opendiscord.debug.debug("-- MIGRATION CONTEXT END --")
}

/**Create a backup of the (dev)config & database before migrating. */
function createMigrationBackup(){
    if (fs.existsSync("./.backup/")) fs.rmSync("./.backup/",{force:true,recursive:true})
    fs.mkdirSync("./.backup/")

    const devconfigFlag = opendiscord.flags.get("opendiscord:dev-config")
    const isDevConfig = devconfigFlag ? devconfigFlag.value : false
    const devDatabaseFlag = opendiscord.flags.get("opendiscord:dev-database")
    const isDevDatabase = devDatabaseFlag ? devDatabaseFlag.value : false

    if (isDevConfig) fs.cpSync("./devconfig/","./.backup/devconfig/",{force:true,recursive:true})
    else fs.cpSync("./config/","./.backup/config/",{force:true,recursive:true})
    if (isDevDatabase) fs.cpSync("./devdatabase/","./.backup/devdatabase/",{force:true,recursive:true})
    else fs.cpSync("./database/","./.backup/database/",{force:true,recursive:true})
}

/**Execute all version migration functions which are handled in the restricted migration context. */
async function loadAllVersionMigrations(lastVersion:api.ODVersion){
    const migrations = (await import("./migration.js")).migrations
    migrations.sort((a,b) => {
        const comparison = a.version.compare(b.version)
        if (comparison == "equal") return 0
        else if (comparison == "higher") return 1
        else return -1
    })
    if (migrations.length > 0){
        //create backup of config & database
        createMigrationBackup()
    }

    for (const migration of migrations){
        if (migration.version.compare(lastVersion) == "higher"){
            const success = await migration.migrate()
            if (success) opendiscord.log("Migrated data to "+migration.version.toString()+"!","debug",[
                {key:"success",value:success ? "true" : "false"},
                {key:"afterInit",value:"false"}
            ])
            else throw new api.ODSystemError("Migration Error: Unable to migrate database & config to the new version of the bot.")
        }
    }
}

/**Execute all version migration functions which are handled in the normal startup sequence. */
export async function loadAllAfterInitVersionMigrations(lastVersion:api.ODVersion){
    const migrations = (await import("./migration.js")).migrations
    migrations.sort((a,b) => {
        const comparison = a.version.compare(b.version)
        if (comparison == "equal") return 0
        else if (comparison == "higher") return 1
        else return -1
    })
    if (migrations.length > 0){
        //create backup of config & database
        createMigrationBackup()
    }

    for (const migration of migrations){
        if (migration.version.compare(lastVersion) == "higher"){
            const success = await migration.migrateAfterInit()
            if (success) opendiscord.log("Migrated data to "+migration.version.toString()+"!","debug",[
                {key:"success",value:success ? "true" : "false"},
                {key:"afterInit",value:"true"}
            ])
            else throw new api.ODSystemError("Migration Error: Unable to migrate database & config to the new version of the bot.")
        }
    }
}