import {Router} from 'express';
import { ticketController } from '../controllers/ticket.controller.js';


const router =new Router();

router.get('/:idTicket',ticketController.getTicket);

export default router;