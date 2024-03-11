import { ticketService } from "../services/ticket.service.js";

const getTicket=  async (req, res) => {
    const { idTicket} = req.params;
    try {
        const ticket = await ticketService.getTicket(idTicket);
        if (!ticket) {
            return res.status(404).json({ message: `Ticket not found` });
        }
        res.status(200).json({ message: 'Ticket found', ticket });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const ticketController ={
    "getTicket":getTicket 
}