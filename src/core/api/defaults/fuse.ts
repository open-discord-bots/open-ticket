///////////////////////////////////////
//DEFAULT FUSE MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

export interface ODOpenTicketFuseList {
    /**Load the default Open Ticket questions (from `config/questions.json`) */
    questionLoading:boolean,
    /**Load the default Open Ticket options (from `config/options.json`) */
    optionLoading:boolean,
    /**Load the default Open Ticket panels (from `config/panels.json`) */
    panelLoading:boolean,
    /**Load the default Open Ticket tickets (from `database/tickets.json`) */
    ticketLoading:boolean,
    /**Load the default Open Ticket reaction roles (from `config/options.json`) */
    roleLoading:boolean,
    /**Load the default Open Ticket blacklist (from `database/users.json`) */
    blacklistLoading:boolean,
    /**Load the default Open Ticket transcript compilers. */
    transcriptCompilerLoading:boolean,
    /**Load the default Open Ticket transcript history (from `database/transcripts.json`) */
    transcriptHistoryLoading:boolean,
    /**The interval in milliseconds that are between autoclose timeout checkers. */
    autocloseCheckInterval:number,
    /**The interval in milliseconds that are between autodelete timeout checkers. */
    autodeleteCheckInterval:number,
}