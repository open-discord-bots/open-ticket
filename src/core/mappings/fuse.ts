///////////////////////////////////////
//OPEN TICKET FUSE MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

export interface ODOpenTicketFuseList {
    /**Load the default Open Ticket ticket priority levels. */
    priorityLoading:boolean,
    /**Load the default Open Ticket questions (from `config/questions.jsonc`) */
    questionLoading:boolean,
    /**Load the default Open Ticket options (from `config/options.jsonc`) */
    optionLoading:boolean,
    /**Load the default Open Ticket panels (from `config/panels.jsonc`) */
    panelLoading:boolean,
    /**Load the default Open Ticket tickets (from `database/tickets.json`) */
    ticketLoading:boolean,
    /**Load the default Open Ticket reaction roles (from `config/options.jsonc`) */
    roleLoading:boolean,
    /**Load the default Open Ticket blacklist (from `database/users.json`) */
    blacklistLoading:boolean,
    /**Load the default Open Ticket transcript compilers. */
    transcriptCompilerLoading:boolean,
    /**Load the default Open Ticket transcript history (from `database/transcripts.jsonc`) */
    transcriptHistoryLoading:boolean,
    /**The interval in milliseconds that are between autoclose timeout checkers. */
    autocloseCheckInterval:number,
    /**The interval in milliseconds that are between autodelete timeout checkers. */
    autodeleteCheckInterval:number,
}