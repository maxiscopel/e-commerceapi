import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // cada usuario tiene un carrito
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Cart", cartSchema);
