import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    thumbnails: {
        type: [String],
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: String,        
        default:"ADMIN"
      },
}
);
productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model("Products", productsSchema);