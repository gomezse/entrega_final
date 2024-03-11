import { ticketsManager } from "../dao/models/mongoose/TicketsManager.js";

class TicketService{
    async getTicket(id){
        const ticket= await ticketsManager.getTicket(id);
        return ticket;
    }
}

export const ticketService = new TicketService();