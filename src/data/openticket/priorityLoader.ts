import {opendiscord, api, utilities} from "../../index"

export const loadAllPriorityLevels = async () => {
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:urgent",5,"urgent","Urgent","🔴","🔴")) //TODO TRANSLATION!!!
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:very-high",4,"very-high","Very High","🟠","🟠")) //TODO TRANSLATION!!!
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:high",3,"high","High","🟡","🟡")) //TODO TRANSLATION!!!
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:normal",2,"normal","Normal","🟢","🟢")) //TODO TRANSLATION!!!
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:low",1,"low","Low","🔵","🔵")) //TODO TRANSLATION!!!
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:very-low",0,"very-low","Very Low","⚪","⚪")) //TODO TRANSLATION!!!
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:none",-1,"none","None",null,null)) //TODO TRANSLATION!!!
}