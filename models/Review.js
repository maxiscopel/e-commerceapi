import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Review", reviewSchema);
