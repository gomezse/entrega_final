import mongoose from "mongoose";
import mongoosPaginate from "mongoose-paginate-v2";


const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
      },
      _id: false
    },
  ],
});



cartsSchema.methods.toJSON = function () {
  const { __v, ...cart } = this.toObject();
  return cart;
}

cartsSchema.pre('find',function(){
    this.populate('products.product');
})

cartsSchema.plugin(mongoosPaginate);

export const cartsModel = mongoose.model("Carts", cartsSchema);