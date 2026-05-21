///////////////////////////////////////
//OPENTICKET OPTION MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODQuestionIdConstraint `type`
 * The constraint/layout for id mappings/interfaces of the `ODQuestion` class.
 */
export type ODQuestionIdConstraint = Record<string,ODQuestionData<api.ODValidJsonType>>

/**## ODShortQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODShortQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODShortQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,
    "opendiscord:placeholder":ODQuestionData<string>,
    
    "opendiscord:length-enabled":ODQuestionData<boolean>,
    "opendiscord:length-min":ODQuestionData<number>,
    "opendiscord:length-max":ODQuestionData<number>
}

/**## ODParagraphQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODParagraphQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODParagraphQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,
    "opendiscord:placeholder":ODQuestionData<string>,
    
    "opendiscord:length-enabled":ODQuestionData<boolean>,
    "opendiscord:length-min":ODQuestionData<number>,
    "opendiscord:length-max":ODQuestionData<number>
}

/**## ODQuestionManager `class`
 * This is an Open Ticket question manager.
 * 
 * This class manages all registered questions in the bot. Only questions which are available in this manager can be used in options.
 * 
 * Questions are not stored in the database and will be parsed from the config every startup.
 */
export class ODQuestionManager extends api.ODManager<ODQuestion> {
    constructor(debug:api.ODDebugger){
        super(debug,"question")
    }
    
    add(data:ODQuestion, overwrite?:boolean): boolean {
        data.useDebug(this.debug,"question data")
        return super.add(data,overwrite)
    }
}

/**## ODQuestionDataJson `interface`
 * The JSON representatation from a single question property.
 */
export interface ODQuestionDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:api.ODValidJsonType
}

/**## ODQuestionDataJson `interface`
 * The JSON representatation from a single question.
 */
export interface ODQuestionJson {
    /**The id of this question. */
    id:string,
    /**The type of this question. */
    type:string,
    /**The version of Open Ticket used to create this question. */
    version:string,
    /**The full list of properties/variables related to this question. */
    data:ODQuestionDataJson[]
}

/**## ODQuestion `class`
 * This is an Open Ticket question.
 * 
 * This class contains all data related to this question (parsed from the config).
 * 
 * Use `ODShortQuestion` or `ODParagraphQuestion` instead!
 */
export class ODQuestion extends api.ODManager<ODQuestionData<api.ODValidJsonType>> {
    /**The id of this question. (from the config) */
    id:api.ODId
    /**The type of this question (e.g. `opendiscord:short` or `opendiscord:paragraph`) */
    type: string

    constructor(id:api.ODValidId, type:string, data:ODQuestionData<api.ODValidJsonType>[]){
        super()
        this.id = new api.ODId(id)
        this.type = type
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**Convert this question to a JSON object for storing this question in the database. */
    toJson(version:api.ODVersion): ODQuestionJson {
        const data = this.getAll().map((data) => {
            return {
                id:data.id.toString(),
                value:data.value
            }
        })
        
        return {
            id:this.id.toString(),
            type:this.type,
            version:version.toString(),
            data
        }
    }

    /**Create a question from a JSON object in the database. */
    static fromJson(json:ODQuestionJson): ODQuestion {
        return new ODQuestion(json.id,json.type,json.data.map((data) => new ODQuestionData(data.id,data.value)))
    }
}

/**## ODQuestionData `class`
 * This is Open Ticket question data.
 * 
 * This class contains a single property for a question. (string, number, boolean, object, array, null)
 * 
 * When this property is edited, the database will be updated automatically.
 */
export class ODQuestionData<DataType extends api.ODValidJsonType> extends api.ODManagerData {
    /**The value of this property. */
    private rawValue: DataType

    constructor(id:api.ODValidId, value:DataType){
        super(id)
        this.rawValue = value
    }

    /**The value of this property. */
    set value(value:DataType){
        this.rawValue = value
        this._change()
    }
    get value(): DataType {
        return this.rawValue
    }
    /**Refresh the database. Is only required to be used when updating `ODQuestionData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}


/**## ODShortQuestion `class`
 * This is an Open Ticket short question.
 * 
 * This class contains all data related to an Open Ticket short question (parsed from the config).
 * 
 * Use this question in an option to add a short text field to the modal!
 */
export class ODShortQuestion extends ODQuestion {
    type: "opendiscord:short" = "opendiscord:short"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]){
        super(id,"opendiscord:short",data)
    }

    get<QuestionId extends keyof api.ODNoGeneric<ODShortQuestionIdMappings>>(id:QuestionId): ODShortQuestionIdMappings[QuestionId]
    get(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null
    
    get(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null {
        return super.get(id)
    }

    remove<QuestionId extends keyof api.ODNoGeneric<ODShortQuestionIdMappings>>(id:QuestionId): ODShortQuestionIdMappings[QuestionId]
    remove(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null
    
    remove(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<ODShortQuestionIdMappings>): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json: ODQuestionJson): ODShortQuestion {
        return new ODShortQuestion(json.id,json.data.map((data) => new ODQuestionData(data.id,data.value)))
    }
}

/**## ODParagraphQuestion `class`
 * This is an Open Ticket paragraph question.
 * 
 * This class contains all data related to an Open Ticket paragraph question (parsed from the config).
 * 
 * Use this question in an option to add a paragraph text field to the modal!
 */
export class ODParagraphQuestion extends ODQuestion {
    type: "opendiscord:paragraph" = "opendiscord:paragraph"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]){
        super(id,"opendiscord:paragraph",data)
    }

    get<QuestionId extends keyof api.ODNoGeneric<ODParagraphQuestionIdMappings>>(id:QuestionId): ODParagraphQuestionIdMappings[QuestionId]
    get(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null
    
    get(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null {
        return super.get(id)
    }

    remove<QuestionId extends keyof api.ODNoGeneric<ODParagraphQuestionIdMappings>>(id:QuestionId): ODParagraphQuestionIdMappings[QuestionId]
    remove(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null
    
    remove(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<ODParagraphQuestionIdMappings>): boolean
    exists(id:api.ODValidId): boolean
    
    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json: ODQuestionJson): ODParagraphQuestion {
        return new ODParagraphQuestion(json.id,json.data.map((data) => new ODQuestionData(data.id,data.value)))
    }
}