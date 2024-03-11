import { ticketsModel } from "../../../models/mongoose/tickets.model.js";

class TicketsManager {
    async createTicket(ticket){
        const response= await ticketsModel.create(ticket);
        return response;
    }

    async getTicket(ticketId){         
        const ticket = await ticketsModel.findById(ticketId);
        return ticket;
        
        
    }

}

export const ticketsManager = new TicketsManager();