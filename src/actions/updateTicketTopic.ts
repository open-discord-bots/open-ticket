///////////////////////////////////////
//TICKET TOPIC SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:update-ticket-topic"))
    opendiscord.actions.get("opendiscord:update-ticket-topic").workers.add([
        new api.ODWorker("opendiscord:update-ticket-topic",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,newTopic} = params
            if (channel.isThread() || !(channel instanceof discord.TextChannel)) throw new api.ODSystemError("Unable to set topic of ticket! Open Ticket doesn't support threads!")

            const oldTopic = ticket.get("opendiscord:topic").value
            if (newTopic) await opendiscord.events.get("onTicketTopicChange").emit([ticket,user,channel,oldTopic,newTopic])

            //update ticket
            ticket.get("opendiscord:busy").value = true
            if (newTopic) ticket.get("opendiscord:topic").value = newTopic

            //get ticket data
            const closed = ticket.get("opendiscord:closed").value
            const claimedBy = ticket.get("opendiscord:claimed-by").value
            const pinned = ticket.get("opendiscord:pinned").value

            //handle channel topic
            const channelTopics: string[] = []
            if (generalConfig.data.system.channelTopic.showOptionName) channelTopics.push(ticket.option.get("opendiscord:name").value)
            if (generalConfig.data.system.channelTopic.showOptionDescription) channelTopics.push(ticket.option.get("opendiscord:description").value)
            if (generalConfig.data.system.channelTopic.showOptionTopic) channelTopics.push(ticket.get("opendiscord:topic").value)
            if (generalConfig.data.system.channelTopic.showPriority) channelTopics.push("**Priority:** "+opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value).renderDisplayName()) //TODO TRANSLATION!!!
            if (generalConfig.data.system.channelTopic.showClosed) channelTopics.push("**Status:** "+(closed ? "Closed" : "Opened")) //TODO TRANSLATION!!!
            if (generalConfig.data.system.channelTopic.showClaimed) channelTopics.push("**Claimed By:** "+(claimedBy ? discord.userMention(claimedBy) : "No-one")) //TODO TRANSLATION!!!
            if (generalConfig.data.system.channelTopic.showPinned) channelTopics.push("**Pinned:** "+(pinned ? "Yes" : "No")) //TODO TRANSLATION!!!
            if (generalConfig.data.system.channelTopic.showCreator) channelTopics.push("**Creator:** "+discord.userMention(user.id)) //TODO TRANSLATION!!!
            if (generalConfig.data.system.channelTopic.showParticipants) channelTopics.push("**Participants:** "+ticket.get("opendiscord:participants").value.map((p) => (p.type == "user") ? discord.userMention(p.id) : discord.roleMention(p.id)).join(", ")) //TODO TRANSLATION!!!

            //update channel
            channel.setTopic(channelTopics.join(" • "),"Topic Changed")

            //reply with new message
            if (params.sendMessage && newTopic) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:topic-set").build(source,{guild,channel,user,ticket,topic:newTopic})).message)
            ticket.get("opendiscord:busy").value = false
            if (newTopic) await opendiscord.events.get("afterTicketTopicChanged").emit([ticket,user,channel,oldTopic,newTopic])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket,newTopic} = params

            if (newTopic) opendiscord.log(user.displayName+" changed the topic of a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"topic",value:newTopic},
                {key:"method",value:source}
            ])
        })
    ])
}