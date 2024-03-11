import mongoose from "mongoose";
import { cartsManager } from "../../dao/models/mongoose/CartsManager.js";
const newCart = await cartsManager.createCart();
const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    default: 18,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "carts",
    default: newCart._id,
  },
  isGitHub: {
    type: Boolean,
    default: false,
  },
  isGoogle: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "PREMIUM", "USER"],
    default: "USER",
  },
  resetToken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResetToken',
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection:{
    type:String,
    default: new Date().toLocaleDateString(),
  }
});

usersSchema.pre("find", function () {
  this.populate("cart");
});

export const usersModel = mongoose.model("Users", usersSchema);
