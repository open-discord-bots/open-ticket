import {opendiscord, api, utilities} from "../../index"

const lang = opendiscord.languages

export const loadAllPriorityLevels = async () => {
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:urgent",5,"urgent",lang.getTranslation("priorities.urgent"),"🔴","🔴"))
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:very-high",4,"very-high",lang.getTranslation("priorities.veryHigh"),"🟠","🟠"))
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:high",3,"high",lang.getTranslation("priorities.high"),"🟡","🟡"))
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:normal",2,"normal",lang.getTranslation("priorities.normal"),"🟢","🟢"))
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:low",1,"low",lang.getTranslation("priorities.low"),"🔵","🔵"))
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:very-low",0,"very-low",lang.getTranslation("priorities.veryLow"),"⚪","⚪"))
    opendiscord.priorities.add(new api.ODPriorityLevel("opendiscord:none",-1,"none",lang.getTranslation("priorities.none"),null,null))
}