import mongoose from "mongoose";

const URI =
  "mongodb+srv://gomezse:root@ecommerce.sp5zu8k.mongodb.net/testing?retryWrites=true&w=majority";
  // "mongodb+srv://coderhouse:coderhouse@cluster0.sugvijj.mongodb.net/swagger47315?retryWrites=true&w=majority"
mongoose
  .connect(URI)
  .then(() => console.log("Conectado a la DB de testing"))
  .catch((error) => console.log(error));