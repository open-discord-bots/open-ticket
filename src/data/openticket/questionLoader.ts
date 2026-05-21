import {opendiscord, api, utilities} from "../../index.js"

export async function loadAllQuestions(){
    const questionConfig = opendiscord.configs.get("opendiscord:questions")
    if (!questionConfig) return
    
    questionConfig.data.forEach((question) => {
        if (question.type == "short"){
            opendiscord.questions.add(loadShortQuestion(question))
        }else if (question.type == "paragraph"){
            opendiscord.questions.add(loadParagraphQuestion(question))
        }
    })

    //update questions on config reload
    questionConfig.onReload(async () => {
        //clear previous questions
        await opendiscord.questions.loopAll((data,id) => {opendiscord.questions.remove(id)})

        //add new questions
        questionConfig.data.forEach((question) => {
            if (question.type == "short"){
                opendiscord.questions.add(loadShortQuestion(question))
            }else if (question.type == "paragraph"){
                opendiscord.questions.add(loadParagraphQuestion(question))
            }
        })
    })
}

export const loadShortQuestion = (option:api.ODQuestionsJsonConfig_ShortQuestion) => {
    return new api.ODShortQuestion(option.id,[
        new api.ODQuestionData("opendiscord:name",option.name),
        new api.ODQuestionData("opendiscord:required",option.required),
        new api.ODQuestionData("opendiscord:placeholder",option.placeholder),

        new api.ODQuestionData("opendiscord:length-enabled",option.length.enabled),
        new api.ODQuestionData("opendiscord:length-min",option.length.min),
        new api.ODQuestionData("opendiscord:length-max",option.length.max),
    ])
}

export const loadParagraphQuestion = (option:api.ODQuestionsJsonConfig_ParagraphQuestion) => {
    return new api.ODParagraphQuestion(option.id,[
        new api.ODQuestionData("opendiscord:name",option.name),
        new api.ODQuestionData("opendiscord:required",option.required),
        new api.ODQuestionData("opendiscord:placeholder",option.placeholder),

        new api.ODQuestionData("opendiscord:length-enabled",option.length.enabled),
        new api.ODQuestionData("opendiscord:length-min",option.length.min),
        new api.ODQuestionData("opendiscord:length-max",option.length.max),
    ])
}