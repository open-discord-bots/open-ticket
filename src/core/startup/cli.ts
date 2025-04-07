import {opendiscord, api, utilities} from "../../index"
import {Terminal, terminal} from "terminal-kit"
import ansis from "ansis"

const logo = [
    "   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  ",
    "  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  ",
    "  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     ",
    "  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     ",
    "  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     ",
    "   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     "
]

/**A utility function to center text to a certain width. */
function centerText(text:string,width:number){
    if (width < text.length) return text
    let newWidth = width-ansis.strip(text).length+1
    let final = " ".repeat(newWidth/2)+text
    return final
}

/**A utility function to terminate the interactive CLI. */
async function terminate(){
    terminal.grabInput(false)
    terminal.clear()
    terminal.green("👋 Exited the Open Ticket Interactive Setup CLI.\n")
    process.exit(0)
}
terminal.on("key",(name,matches,data) => {
    if (name == "CTRL_C") terminate()
})

/**Render the header of the interactive CLI. */
function renderHeader(path:(string|number)[]){
    terminal.grabInput(true)
    terminal.clear().moveTo(1,1)
    terminal(ansis.hex("#f8ba00")(logo.join("\n")+"\n"))
    terminal.bold(centerText("Interactive Setup CLI  -  Version: "+opendiscord.versions.get("opendiscord:version").toString()+"  -  Support: https://discord.dj-dj.be\n",88))
    if (path.length < 1) terminal.cyan(centerText("👋 Hi! Welcome to the Open Ticket Interactive Setup CLI! 👋\n\n",88))
    else terminal.cyan(centerText("🌐 Current Location: "+path.map((v,i) => {
        if (i == 0) return v.toString()
        else if (typeof v == "string") return ".\""+v+"\""
        else if (typeof v == "number") return "."+v
    }).join("")+"\n\n",88))
}

async function renderConfigSelector(backFn:(() => api.ODPromiseVoid)){
    renderHeader([])
    terminal(ansis.bold.green("Please select which config you would like to edit.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))

    const checkerList = opendiscord.checkers.getAll()
    const checkerNameList = checkerList.map((checker) => (checker.options.cliDisplayName ? checker.options.cliDisplayName+" ("+checker.config.file+")" : checker.config.file))
    const checkerNameLength = utilities.getLongestLength(checkerNameList)
    const finalCheckerNameList = checkerNameList.map((name,index) => name.padEnd(checkerNameLength+5," ")+ansis.gray(checkerList[index].options.cliDisplayDescription ? "=> "+checkerList[index].options.cliDisplayDescription : ""))
    
    const answer = await terminal.singleColumnMenu(finalCheckerNameList,{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    const checker = checkerList[answer.selectedIndex]
    const configData = checker.config.data as api.ODValidJsonType
    await chooseConfigStructure(checker,async () => {await renderConfigSelector(backFn)},checker.structure,configData,{},NaN,["("+checker.config.path+")"])
}

async function chooseConfigStructure(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerStructure,data:api.ODValidJsonType,parent:object|any[],parentIndex:string|number,path:(string|number)[]){
    if (structure instanceof api.ODCheckerObjectStructure && typeof data == "object" && !Array.isArray(data) && data) await renderConfigObjectStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerEnabledObjectStructure && typeof data == "object" && !Array.isArray(data) && data) await renderConfigEnabledObjectStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerObjectSwitchStructure && typeof data == "object" && !Array.isArray(data) && data) await renderConfigObjectSwitchStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerArrayStructure && Array.isArray(data)) await renderConfigArrayStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerBooleanStructure && typeof data == "boolean") await renderConfigBooleanStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerNumberStructure && typeof data == "number") await renderConfigNumberStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerStringStructure && typeof data == "string") await renderConfigStringStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerNullStructure && data === null) await renderConfigNullStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    else if (structure instanceof api.ODCheckerTypeSwitchStructure) await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    else terminal.red.bold("❌ Unable to detect type of variable! Please try to edit this property in the JSON file itself!")
}

async function renderConfigObjectStructureSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerObjectStructure,data:object,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (typeof data != "object" || Array.isArray(data)) throw new Error("OT CLI => Property is not of the type 'object'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    renderHeader(path)
    terminal(ansis.bold.green("Please select which variable you would like to edit.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    if (!structure.options.children) return await backFn()

    const list = structure.options.children.filter((child) => !child.cliHideInEditMode)
    const nameList = list.map((child) => (child.checker.options.cliDisplayName ? child.checker.options.cliDisplayName+" ("+child.key+")" : child.key))
    const nameLength = utilities.getLongestLength(nameList)
    const finalnameList = nameList.map((name,index) => name.padEnd(nameLength+5," ")+ansis.gray(list[index].checker.options.cliDisplayDescription ? "=> "+list[index].checker.options.cliDisplayDescription : ""))
    

    const answer = await terminal.singleColumnMenu(finalnameList,{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    const subStructure = list[answer.selectedIndex]
    const subData = data[subStructure.key]
    await chooseConfigStructure(checker,async () => {await renderConfigObjectStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)},subStructure.checker,subData,data,subStructure.key,[...path,subStructure.key])
}

async function renderConfigEnabledObjectStructureSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerEnabledObjectStructure,data:object,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (typeof data != "object" || Array.isArray(data)) throw new Error("OT CLI => Property is not of the type 'object'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    const enabledProperty = structure.options.property
    const subStructure = structure.options.checker
    if (!enabledProperty || !subStructure || !subStructure.options.children) return await backFn()

    if (!subStructure.options.children.find((child) => child.key === structure.options.property)){
        if (typeof structure.options.enabledValue == "string") subStructure.options.children.unshift({key:enabledProperty,optional:false,priority:1,checker:new api.ODCheckerStringStructure("opendiscord:CLI-checker-enabled-object-structure",{})})
        else if (typeof structure.options.enabledValue == "number") subStructure.options.children.unshift({key:enabledProperty,optional:false,priority:1,checker:new api.ODCheckerNumberStructure("opendiscord:CLI-checker-enabled-object-structure",{})})
        else if (typeof structure.options.enabledValue == "boolean") subStructure.options.children.unshift({key:enabledProperty,optional:false,priority:1,checker:new api.ODCheckerBooleanStructure("opendiscord:CLI-checker-enabled-object-structure",{})})
    }

    await chooseConfigStructure(checker,backFn,subStructure,data,parent,parentIndex,path)
}

async function renderConfigObjectSwitchStructureSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerObjectSwitchStructure,data:object,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (typeof data != "object" || Array.isArray(data)) throw new Error("OT CLI => Property is not of the type 'object'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    if (!structure.options.objects) return await backFn()

    let didMatch: boolean = false
    for (const objectTemplate of structure.options.objects){
        if (objectTemplate.properties.every((prop) => data[prop.key] === prop.value)){
            //object template matches data
            const subStructure = objectTemplate.checker
            didMatch = true
            await chooseConfigStructure(checker,backFn,subStructure,data,parent,parentIndex,path)
        }
    }
    if (!didMatch) throw new Error("OT CLI => Unable to detect type of object in the object switch. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
}

async function renderConfigArrayStructureSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerArrayStructure,data:any[],parent:object,parentIndex:string|number,path:(string|number)[]){
    if (!Array.isArray(data)) throw new Error("OT CLI => Property is not of the type 'array'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    renderHeader(path)
    terminal(ansis.bold.green("Please select what you would like to do.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    if (!structure.options.propertyChecker) return await backFn()

    const propertyName = structure.options.cliDisplayPropertyName ?? "index"
    const answer = await terminal.singleColumnMenu(data.length < 1 ? ["Add "+propertyName] : [
        "Add "+propertyName,
        "Edit "+propertyName,
        "Move "+propertyName,
        "Remove "+propertyName,
        "Duplicate "+propertyName
    ],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    if (answer.selectedIndex == 0){
        //TODO => add => trigger chooseConfigStructure() function but for "addition instead of editing"
    }else if (answer.selectedIndex == 1) await renderConfigArrayStructureEditSelector(checker,async () => {await renderConfigArrayStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)},structure,structure.options.propertyChecker,data,parent,parentIndex,path)
    else if (answer.selectedIndex == 2) await renderconfigArrayStructureMoveSelector(checker,async () => {await renderConfigArrayStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)},structure,structure.options.propertyChecker,data,parent,parentIndex,path)
    else if (answer.selectedIndex == 3) await renderconfigArrayStructureRemoveSelector(checker,async () => {await renderConfigArrayStructureSelector(checker,backFn,structure,data,parent,parentIndex,path)},structure,structure.options.propertyChecker,data,parent,parentIndex,path)
    else if (answer.selectedIndex == 4){
        //TODO => duplicate trigger chooseConfigStructure() function but for "addition instead of editing"
    }
    
}

async function renderConfigArrayStructureEditSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),arrayStructure:api.ODCheckerArrayStructure,structure:api.ODCheckerStructure,data:any[],parent:object,parentIndex:string|number,path:(string|number)[]){
    const propertyName = arrayStructure.options.cliDisplayPropertyName ?? "index"
    renderHeader(path)
    terminal(ansis.bold.green("Please select the "+propertyName+" you would like to edit.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))

    const longestDataListName = Math.max(...data.map((d,i) => getArrayPreviewStructureNameLength(structure,d,data,i)))
    const dataList = data.map((d,i) => (i+1)+". "+getArrayPreviewFromStructure(structure,d,data,i,longestDataListName))
    const dataAnswer = await terminal.singleColumnMenu(dataList,{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (dataAnswer.canceled) return await backFn()
    const subData = data[dataAnswer.selectedIndex]
    await chooseConfigStructure(checker,async () => {await renderConfigArrayStructureEditSelector(checker,backFn,arrayStructure,structure,data,parent,parentIndex,path)},structure,subData,data,dataAnswer.selectedIndex,[...path,dataAnswer.selectedIndex])
}

async function renderconfigArrayStructureMoveSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),arrayStructure:api.ODCheckerArrayStructure,structure:api.ODCheckerStructure,data:any[],parent:object,parentIndex:string|number,path:(string|number)[]){
    const propertyName = arrayStructure.options.cliDisplayPropertyName ?? "index"
    renderHeader(path)
    terminal(ansis.bold.green("Please select the "+propertyName+" you would like to move.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    
    const longestDataListName = Math.max(...data.map((d,i) => getArrayPreviewStructureNameLength(structure,d,data,i)))
    const dataList = data.map((d,i) => (i+1)+". "+getArrayPreviewFromStructure(structure,d,data,i,longestDataListName))
    const dataAnswer = await terminal.singleColumnMenu(dataList,{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (dataAnswer.canceled) return await backFn()
    
    renderHeader([...path,dataAnswer.selectedIndex])
    terminal(ansis.bold.green("Please select the position you would like to move to.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))

    const moveAnswer = await terminal.singleColumnMenu(data.map((d,i) => "Position "+(i+1)),{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (moveAnswer.canceled) return await renderconfigArrayStructureMoveSelector(checker,backFn,arrayStructure,structure,data,parent,parentIndex,path)
    
        const subData = data[dataAnswer.selectedIndex]
    const slicedData = [...data.slice(0,dataAnswer.selectedIndex),...data.slice(dataAnswer.selectedIndex+1)]
    const insertedData = [...slicedData.slice(0,moveAnswer.selectedIndex),subData,...slicedData.slice(moveAnswer.selectedIndex)]
    insertedData.forEach((d,i) => data[i] = d)
    terminal.bold.blue("\n\n✅ Property moved succesfully!")
    await utilities.timer(400)
    await backFn()
}

async function renderconfigArrayStructureRemoveSelector(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),arrayStructure:api.ODCheckerArrayStructure,structure:api.ODCheckerStructure,data:any[],parent:object,parentIndex:string|number,path:(string|number)[]){
    const propertyName = arrayStructure.options.cliDisplayPropertyName ?? "index"
    renderHeader(path)
    terminal(ansis.bold.green("Please select the "+propertyName+" you would like to delete.\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    
    const longestDataListName = Math.max(...data.map((d,i) => getArrayPreviewStructureNameLength(structure,d,data,i)))
    const dataList = data.map((d,i) => (i+1)+". "+getArrayPreviewFromStructure(structure,d,data,i,longestDataListName))
    const dataAnswer = await terminal.singleColumnMenu(dataList,{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise

    if (dataAnswer.canceled) return await backFn()
    data.splice(dataAnswer.selectedIndex,1)
    terminal.bold.blue("\n\n✅ Property deleted succesfully!")
    await utilities.timer(400)
    await backFn()
}

async function renderConfigBooleanStructureEditor(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerBooleanStructure,data:boolean,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (typeof data != "boolean") throw new Error("OT CLI => Property is not of the type 'boolean'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    renderHeader(path)
    terminal(ansis.bold.green("You are now editing "+(typeof parentIndex == "string" ? "the boolean property "+ansis.blue("\""+parentIndex+"\"") : "boolean property "+ansis.blue("nr."+(parentIndex+1)))+".\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    
    terminal.gray("\nCurrent value: "+ansis.bold[data ? "green" : "red"](data.toString())+"\n")

    const answer = await terminal.singleColumnMenu(["false (Disabled)","true (Enabled)"],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    
    //run config checker
    const newValue = (answer.selectedIndex == 0) ? false : true
    const newPath = [...path]
    newPath.shift()
    checker.messages = [] //manually clear previous messages
    const isDataValid = structure.check(checker,newValue,newPath)

    if (isDataValid){
        parent[parentIndex] = newValue
        terminal.bold.blue("\n\n✅ Variable saved succesfully!")
        await utilities.timer(400)
        await backFn()
    }else{
        const messages = checker.messages.map((msg) => "=> ["+msg.type.toUpperCase()+"] "+msg.message).join("\n")
        terminal.bold.blue("\n\n❌ Variable is invalid! Please try again!")
        terminal.gray("\n"+messages)
        await utilities.timer(1000+(2000*checker.messages.length))
        await renderConfigBooleanStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    }
}

async function renderConfigNumberStructureEditor(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerNumberStructure,data:number,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (typeof data != "number") throw new Error("OT CLI => Property is not of the type 'number'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    renderHeader(path)
    terminal(ansis.bold.green("You are now editing "+(typeof parentIndex == "string" ? "the number property "+ansis.blue("\""+parentIndex+"\"") : "number property "+ansis.blue("nr."+(parentIndex+1)))+".\n")+ansis.italic.gray("(insert a new value and press enter, go back using escape)\n"))
    
    terminal.gray("\nCurrent value: "+ansis.bold.blue(data.toString())+"\n")

    const answer = await terminal.inputField({
        style:terminal.cyan,
        cancelable:true
    }).promise
    
    if (typeof answer != "string") return await backFn()
    
    //run config checker
    const newValue = Number(answer.replaceAll(",","."))
    const newPath = [...path]
    newPath.shift()
    checker.messages = [] //manually clear previous messages
    const isDataValid = structure.check(checker,newValue,newPath)

    if (isDataValid){
        parent[parentIndex] = newValue
        terminal.bold.blue("\n\n✅ Variable saved succesfully!")
        await utilities.timer(400)
        await backFn()
    }else{
        const messages = checker.messages.map((msg) => "=> ["+msg.type.toUpperCase()+"] "+msg.message).join("\n")
        terminal.bold.blue("\n\n❌ Variable is invalid! Please try again!")
        terminal.red("\n"+messages)
        await utilities.timer(1000+(2000*checker.messages.length))
        await renderConfigNumberStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    }
}

async function renderConfigStringStructureEditor(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerStringStructure,data:string,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (typeof data != "string") throw new Error("OT CLI => Property is not of the type 'string'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    renderHeader(path)
    terminal(ansis.bold.green("You are now editing "+(typeof parentIndex == "string" ? "the string property "+ansis.blue("\""+parentIndex+"\"") : "string property "+ansis.blue("nr."+(parentIndex+1)))+".\n")+ansis.italic.gray("(insert a new value and press enter, go back using escape)\n"))
    
    terminal.gray("\nCurrent value:"+(data.includes("\n") ? "\n" : " ")+ansis.bold.blue(data)+"\n")

    const autocompleteList = structure.options.cliAutocompleteList ?? structure.options.choices
    const autoCompleteMenuOpts: Terminal.SingleLineMenuOptions = {
        style:terminal.white,
        selectedStyle:terminal.bgBlue.white
    }

    const answer = await terminal.inputField({
        style:terminal.cyan,
        hintStyle:terminal.gray,
        cancelable:true,
        autoComplete:autocompleteList,
        autoCompleteHint:(!!autocompleteList),
        autoCompleteMenu:(autocompleteList) ? autoCompleteMenuOpts as Terminal.Autocompletion : false
    }).promise
    
    if (typeof answer != "string") return await backFn()
    
    //run config checker
    const newValue = answer.replaceAll("\\n","\n")
    const newPath = [...path]
    newPath.shift()
    checker.messages = [] //manually clear previous messages
    const isDataValid = structure.check(checker,newValue,newPath)

    if (isDataValid){
        parent[parentIndex] = newValue
        terminal.bold.blue("\n\n✅ Variable saved succesfully!")
        await utilities.timer(400)
        await backFn()
    }else{
        const messages = checker.messages.map((msg) => "=> ["+msg.type.toUpperCase()+"] "+msg.message).join("\n")
        terminal.bold.blue("\n\n❌ Variable is invalid! Please try again!")
        terminal.red("\n"+messages)
        await utilities.timer(1000+(2000*checker.messages.length))
        await renderConfigStringStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    }
}

async function renderConfigNullStructureEditor(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerNullStructure,data:null,parent:object,parentIndex:string|number,path:(string|number)[]){
    if (data !== null) throw new Error("OT CLI => Property is not of the type 'null'. Please check your config for possible errors. (index: "+parentIndex+", path: "+path.join(".")+")")
    renderHeader(path)
    terminal(ansis.bold.green("You are now editing "+(typeof parentIndex == "string" ? "the null property "+ansis.blue("\""+parentIndex+"\"") : "null property "+ansis.blue("nr."+(parentIndex+1)))+".\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    
    terminal.gray("\nCurrent value:"+ansis.bold.blue("null")+"\n")

    const answer = await terminal.singleColumnMenu(["null"],{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    
    //run config checker
    const newValue = null
    const newPath = [...path]
    newPath.shift()
    checker.messages = [] //manually clear previous messages
    const isDataValid = structure.check(checker,newValue,newPath)

    if (isDataValid){
        parent[parentIndex] = newValue
        terminal.bold.blue("\n\n✅ Variable saved succesfully!")
        await utilities.timer(400)
        await backFn()
    }else{
        const messages = checker.messages.map((msg) => "=> ["+msg.type.toUpperCase()+"] "+msg.message).join("\n")
        terminal.bold.blue("\n\n❌ Variable is invalid! Please try again!")
        terminal.red("\n"+messages)
        await utilities.timer(1000+(2000*checker.messages.length))
        await renderConfigNullStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)
    }
}

async function renderConfigTypeSwitchStructureEditor(checker:api.ODChecker,backFn:(() => api.ODPromiseVoid),structure:api.ODCheckerTypeSwitchStructure,data:any,parent:object,parentIndex:string|number,path:(string|number)[]){
    renderHeader(path)
    terminal(ansis.bold.green("You are now editing "+(typeof parentIndex == "string" ? "the property "+ansis.blue("\""+parentIndex+"\"") : "property "+ansis.blue("nr."+(parentIndex+1)))+".\n")+ansis.italic.gray("(use arrow keys to navigate, go back using escape)\n"))
    
    terminal.gray("\nCurrent value: "+ansis.bold.blue(data.toString())+"\n")

    const actionsList: string[] = []
    if (structure.options.boolean) actionsList.push("Edit as boolean")
    if (structure.options.string) actionsList.push("Edit as string")
    if (structure.options.number) actionsList.push("Edit as number")
    if (structure.options.object) actionsList.push("Edit as object")
    if (structure.options.array) actionsList.push("Edit as array/list")
    if (structure.options.null) actionsList.push("Edit as null")
    
    const answer = await terminal.singleColumnMenu(actionsList,{
        leftPadding:"> ",
        style:terminal.cyan,
        selectedStyle:terminal.bgDefaultColor.bold,
        submittedStyle:terminal.bgBlue,
        extraLines:2,
        cancelable:true
    }).promise
    
    if (answer.canceled) return await backFn()
    
    //run selected structure editor (untested)
    if (answer.selectedText.startsWith("Edit as boolean") && structure.options.boolean) await renderConfigBooleanStructureEditor(checker,async () => {await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)},structure.options.boolean,false,parent,parentIndex,path)
    else if (answer.selectedText.startsWith("Edit as string") && structure.options.string) await renderConfigStringStructureEditor(checker,async () => {await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)},structure.options.string,data.toString(),parent,parentIndex,path)
    else if (answer.selectedText.startsWith("Edit as number") && structure.options.number) await renderConfigNumberStructureEditor(checker,async () => {await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)},structure.options.number,0,parent,parentIndex,path)
    else if (answer.selectedText.startsWith("Edit as object") && structure.options.object) await renderConfigObjectStructureSelector(checker,async () => {await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)},structure.options.object,data,parent,parentIndex,path)
    else if (answer.selectedText.startsWith("Edit as array/list") && structure.options.array) await renderConfigArrayStructureSelector(checker,async () => {await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)},structure.options.array,data,parent,parentIndex,path)
    else if (answer.selectedText.startsWith("Edit as null") && structure.options.null) await renderConfigNullStructureEditor(checker,async () => {await renderConfigTypeSwitchStructureEditor(checker,backFn,structure,data,parent,parentIndex,path)},structure.options.null,null,parent,parentIndex,path)
}

function getArrayPreviewStructureNameLength(structure:api.ODCheckerStructure,data:api.ODValidJsonType,parent:object,parentIndex:string|number): number {
    if (structure instanceof api.ODCheckerBooleanStructure && typeof data == "boolean") return data.toString().length
    else if (structure instanceof api.ODCheckerNumberStructure && typeof data == "number") return data.toString().length
    else if (structure instanceof api.ODCheckerStringStructure && typeof data == "string") return data.length
    else if (structure instanceof api.ODCheckerNullStructure && data === null) return "Null".length
    else if (structure instanceof api.ODCheckerArrayStructure && Array.isArray(data)) return "Array".length
    else if (structure instanceof api.ODCheckerObjectStructure && typeof data == "object" && !Array.isArray(data) && data){
        if (!structure.options.cliDisplayKeyInParentArray) return "Object".length
        else return data[structure.options.cliDisplayKeyInParentArray].toString().length

    }else if (structure instanceof api.ODCheckerEnabledObjectStructure && typeof data == "object" && !Array.isArray(data) && data){
        const subStructure = structure.options.checker
        if (!subStructure) return "<unknown-property>".length
        return getArrayPreviewStructureNameLength(subStructure,data,parent,parentIndex)

    }else if (structure instanceof api.ODCheckerObjectSwitchStructure && typeof data == "object" && !Array.isArray(data) && data){
        for (const objectTemplate of (structure.options.objects ?? [])){
            if (objectTemplate.properties.every((prop) => data[prop.key] === prop.value)){
                //object template matches data
                const subStructure = objectTemplate.checker
                return getArrayPreviewStructureNameLength(subStructure,data,parent,parentIndex)
            }
        }
        return "<unknown-property>".length

    }else if (structure instanceof api.ODCheckerTypeSwitchStructure){
        if (typeof data == "boolean" && structure.options.boolean) return getArrayPreviewStructureNameLength(structure.options.boolean,data,parent,parentIndex)
        else if (typeof data == "number" && structure.options.number) return getArrayPreviewStructureNameLength(structure.options.number,data,parent,parentIndex)
        else if (typeof data == "string" && structure.options.string) return getArrayPreviewStructureNameLength(structure.options.string,data,parent,parentIndex)
        else if (typeof data == "object" && !Array.isArray(data) && data && structure.options.object) return getArrayPreviewStructureNameLength(structure.options.object,data,parent,parentIndex)
        else if (Array.isArray(data) && structure.options.array) return getArrayPreviewStructureNameLength(structure.options.array,data,parent,parentIndex)
        else if (data === null && structure.options.null) return getArrayPreviewStructureNameLength(structure.options.null,data,parent,parentIndex)
        else return "<unknown-property>".length
    }else return "<unknown-property>".length
}

function getArrayPreviewFromStructure(structure:api.ODCheckerStructure,data:api.ODValidJsonType,parent:object,parentIndex:string|number,nameLength:number): string {
    if (structure instanceof api.ODCheckerBooleanStructure && typeof data == "boolean") return data.toString()
    else if (structure instanceof api.ODCheckerNumberStructure && typeof data == "number") return data.toString()
    else if (structure instanceof api.ODCheckerStringStructure && typeof data == "string") return data
    else if (structure instanceof api.ODCheckerNullStructure && data === null) return "Null"
    else if (structure instanceof api.ODCheckerArrayStructure && Array.isArray(data)) return "Array"
    else if (structure instanceof api.ODCheckerObjectStructure && typeof data == "object" && !Array.isArray(data) && data){
        const additionalKeys = (structure.options.cliDisplayAdditionalKeysInParentArray ?? []).map((key) => key+": "+data[key].toString()).join(", ")
        if (!structure.options.cliDisplayKeyInParentArray) return "Object"
        else return data[structure.options.cliDisplayKeyInParentArray].toString().padEnd(nameLength+5," ")+ansis.gray(additionalKeys.length > 0 ? "("+additionalKeys+")" : "")

    }else if (structure instanceof api.ODCheckerEnabledObjectStructure && typeof data == "object" && !Array.isArray(data) && data){
        const subStructure = structure.options.checker
        if (!subStructure) return "<unknown-property>"
        return getArrayPreviewFromStructure(subStructure,data,parent,parentIndex,nameLength)

    }else if (structure instanceof api.ODCheckerObjectSwitchStructure && typeof data == "object" && !Array.isArray(data) && data){
        for (const objectTemplate of (structure.options.objects ?? [])){
            if (objectTemplate.properties.every((prop) => data[prop.key] === prop.value)){
                //object template matches data
                const subStructure = objectTemplate.checker
                return getArrayPreviewFromStructure(subStructure,data,parent,parentIndex,nameLength)
            }
        }
        return "<unknown-property>"

    }else if (structure instanceof api.ODCheckerTypeSwitchStructure){
        if (typeof data == "boolean" && structure.options.boolean) return getArrayPreviewFromStructure(structure.options.boolean,data,parent,parentIndex,nameLength)
        else if (typeof data == "number" && structure.options.number) return getArrayPreviewFromStructure(structure.options.number,data,parent,parentIndex,nameLength)
        else if (typeof data == "string" && structure.options.string) return getArrayPreviewFromStructure(structure.options.string,data,parent,parentIndex,nameLength)
        else if (typeof data == "object" && !Array.isArray(data) && data && structure.options.object) return getArrayPreviewFromStructure(structure.options.object,data,parent,parentIndex,nameLength)
        else if (Array.isArray(data) && structure.options.array) return getArrayPreviewFromStructure(structure.options.array,data,parent,parentIndex,nameLength)
        else if (data === null && structure.options.null) return getArrayPreviewFromStructure(structure.options.null,data,parent,parentIndex,nameLength)
        else return "<unknown-property>"
    }else return "<unknown-property>"
}

export async function execute(){
    if (terminal.width < 100 || terminal.height < 35){
        terminal(ansis.red.bold("\n\nMake sure your console or cmd window has a "+ansis.cyan("minimum width & height")+" of "+ansis.cyan("100x35")+" characters."))
        terminal(ansis.red.bold("\nOtherwise the Open Ticket Interactive Setup CLI will be rendered incorrectly."))
        terminal(ansis.red.bold("\nThe current terminal dimensions are: "+ansis.cyan(terminal.width+"x"+terminal.height)+"."))
    }else await renderConfigSelector(terminate)
}