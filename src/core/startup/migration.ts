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
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.3"),async () => {},async () => {}),

    //MIGRATE TO v4.0.4
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.4"),async () => {},async () => {}),

    //MIGRATE TO v4.0.5
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.5"),async () => {},async () => {}),

    //MIGRATE TO v4.0.6
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.6"),async () => {},async () => {}),

    //MIGRATE TO v4.0.7
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.7"),async () => {},async () => {}),

    //MIGRATE TO v4.1.0
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.1.0"),async () => {},async () => {
        //AFTER INIT MIGRATION

        //migrate config
        const generalConfig = opendiscord.configs.get("opendiscord:general")
        const optionConfig = opendiscord.configs.get("opendiscord:options")

        if (!generalConfig.data.status.state){
            //only migrate config when it hasn't been done manually by the user.

            if (!generalConfig.data._INFO) throw new api.ODSystemError("Couldn't find general.json '_INFO' category.")
            generalConfig.data._INFO.version = "open-ticket-v4.1.0"

            if (!generalConfig.data.status) throw new api.ODSystemError("Couldn't find general.json 'status' category.")
            generalConfig.data.status.mode = generalConfig.data.status["status"] ?? "online"
            generalConfig.data.status.state = ""
            delete generalConfig.data.status["status"]

            if (!generalConfig.data.system) throw new api.ODSystemError("Couldn't find general.json 'system' category.")
            generalConfig.data.system.displayFieldsWithQuestions = false
            generalConfig.data.system.showGlobalAdminsInPanelRoles = false
            generalConfig.data.system.alwaysShowReason = false
            generalConfig.data.system.pinEmoji = "📌"
            generalConfig.data.system.askPriorityOnTicketCreation = false
            generalConfig.data.system.disableAutocloseAfterReopen = true
            generalConfig.data.system.autodeleteRequiresClosedTicket = true
            generalConfig.data.system.adminOnlyDeleteWithoutTranscript = true
            generalConfig.data.system.allowCloseBeforeMessage = false
            generalConfig.data.system.allowCloseBeforeAdminMessage = true
            generalConfig.data.system.pinFirstTicketMessage = false

            generalConfig.data.system.channelTopic = {
                showOptionName:true,
                showOptionDescription:false,
                showOptionTopic:true,
                showPriority:false,
                showClosed:true,
                showClaimed:false,
                showPinned:false,
                showCreator:false,
                showParticipants:false
            }

            if (!generalConfig.data.system.permissions) throw new api.ODSystemError("Couldn't find general.json 'system.permissions' category.")
            generalConfig.data.system.permissions.transfer = "admin"
            generalConfig.data.system.permissions.topic = "admin"
            generalConfig.data.system.permissions.priority = "admin"

            if (!generalConfig.data.system.messages) throw new api.ODSystemError("Couldn't find general.json 'system.messages' category.")
            generalConfig.data.system.messages.transferring = {dm:false,logs:true}
            generalConfig.data.system.messages.topicChange = {dm:false,logs:true}
            generalConfig.data.system.messages.priorityChange = {dm:false,logs:true}
            generalConfig.data.system.messages.reactionRole = generalConfig.data.system.messages["roleAdding"] ?? {dm:false,logs:true}
            delete generalConfig.data.system.messages["roleAdding"]
            delete generalConfig.data.system.messages["roleRemoving"]
            
            for (const option of optionConfig.data){
                if (option.type != "ticket") continue
                option.channel.topic = option.channel["description"] ?? ""
                delete option.channel["description"]
                
                option.slowMode = {
                    enabled:false,
                    slowModeSeconds:20
                }
            }

            await generalConfig.save()
            await optionConfig.save()
        }

        //migrate database
        const optionDatabase = opendiscord.databases.get("opendiscord:options")
        const ticketDatabase = opendiscord.databases.get("opendiscord:tickets")

        for (const option of (await optionDatabase.getCategory("opendiscord:used-option") ?? [])){
            const optionData = option.value
            
            const topicData = optionData.data.find((d) => d.id == "opendiscord:channel-description")
            if (topicData) topicData.id = "opendiscord:channel-topic"
            if (!optionData.data.find((d) => d.id == "opendiscord:slowmode-enabled")) optionData.data.push({id:"opendiscord:slowmode-enabled",value:false})
            if (!optionData.data.find((d) => d.id == "opendiscord:slowmode-seconds")) optionData.data.push({id:"opendiscord:slowmode-seconds",value:20})

            optionDatabase.set("opendiscord:used-option",option.key,optionData)
        }

        for (const ticket of (await ticketDatabase.getCategory("opendiscord:ticket") ?? [])){
            const ticketData = ticket.value
            
            if (!ticketData.data.find((d) => d.id == "opendiscord:previous-creators")) ticketData.data.push({id:"opendiscord:previous-creators",value:[]})
            if (!ticketData.data.find((d) => d.id == "opendiscord:reopened")) ticketData.data.push({id:"opendiscord:reopened",value:false})
            if (!ticketData.data.find((d) => d.id == "opendiscord:reopened-by")) ticketData.data.push({id:"opendiscord:reopened-by",value:null})
            if (!ticketData.data.find((d) => d.id == "opendiscord:reopened-on")) ticketData.data.push({id:"opendiscord:reopened-on",value:null})
            if (!ticketData.data.find((d) => d.id == "opendiscord:priority")) ticketData.data.push({id:"opendiscord:priority",value:-1})
            if (!ticketData.data.find((d) => d.id == "opendiscord:topic")) ticketData.data.push({id:"opendiscord:topic",value:""})
            if (!ticketData.data.find((d) => d.id == "opendiscord:message-sent")) ticketData.data.push({id:"opendiscord:message-sent",value:true})
            if (!ticketData.data.find((d) => d.id == "opendiscord:admin-message-sent")) ticketData.data.push({id:"opendiscord:admin-message-sent",value:true})

            ticketDatabase.set("opendiscord:ticket",ticket.key,ticketData)
        }
    }),

    //MIGRATE TO v4.1.1
    new utilities.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.1.1"),async () => {},async () => {}),

]