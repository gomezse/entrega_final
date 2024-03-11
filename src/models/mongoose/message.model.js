import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: " "
    }
});

export const messagesModel = mongoose.model("Messages", messagesSchema);