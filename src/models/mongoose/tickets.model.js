import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    
    amount: {
        type: Number,
        required: true,
    },    
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime:{
        type:Date,
        required: true
    },
    purchaser: {
        type:String, //necesita el email....
        required:true,
    }
})

ticketSchema.methods.toJSON = function () {
    const { __v, ...ticket } = this.toObject();
    return ticket;
  }


export const ticketsModel = mongoose.model("Tickets", ticketSchema);