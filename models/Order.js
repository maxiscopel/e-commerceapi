import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productos: [
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
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ["pendiente", "pagado", "enviado", "cancelado"],
    default: "pendiente"
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);
