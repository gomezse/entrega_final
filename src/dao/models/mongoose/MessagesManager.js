import {messagesModel} from '../../../models/mongoose/message.model.js'

class MessagesManager{


async getMessages() {
    try {
        const messages = await messagesModel.find();
        return messages;
    } catch (error) {
        return error;
    }
}

async createOne(message) {
    try {    
        const newMessage = await messagesModel.create(message);

        return newMessage;
    } catch (error) {
        return error;
    }
}
}

export const messagesManager = new MessagesManager();
