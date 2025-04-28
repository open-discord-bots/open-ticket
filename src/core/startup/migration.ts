import {opendiscord, api, utilities} from "../../index"

export const migrations = [
    //MIGRATE TO v4.0.0
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.0"),async () => {},async () => {}),
    
    //MIGRATE TO v4.0.1
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.1"),async () => {},async () => {
        //AFTER INIT MIGRATION

        //add opendiscord:panel-message properties for all existing panels.
        const globalDatabase = opendiscord.databases.get("opendiscord:global")
        for (const panel of (await globalDatabase.getCategory("opendiscord:panel-update") ?? [])){
            globalDatabase.set("opendiscord:panel-message",panel.key,panel.value)
        }
    }),

    //MIGRATE TO v4.0.2
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.2"),async () => {},async () => {}),
    
    //MIGRATE TO v4.0.3
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.3"),async () => {},async () => {})
]