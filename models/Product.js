import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
 categoria: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "category",required: true},
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  marca: { type: String },
  reseñas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

export default mongoose.model("Product", productSchema);
