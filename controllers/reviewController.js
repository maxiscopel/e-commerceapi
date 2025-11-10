import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

//  Crear reseña (solo si el usuario compró el producto)
export const crearResena = async (req, res) => {
  try {
    const { usuario, producto, calificacion, comentario } = req.body;

    // Verificar si el usuario compró el producto
    const compra = await Order.findOne({
      usuario,
      "productos.producto": producto
    });

    if (!compra) {
      return res.status(403).json({
        success: false,
        message: "Solo podés reseñar productos que compraste."
      });
    }

    // Crear reseña
    const resena = await Review.create({ usuario, producto, calificacion, comentario });

    // Agregar la reseña al producto
    await Product.findByIdAndUpdate(producto, { $push: { reseñas: resena._id } });

    res.status(201).json({ success: true, data: resena });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Listar todas las reseñas
export const listarResenas = async (req, res) => {
  try {
    const resenas = await Review.find()
      .populate("usuario", "nombre email")
      .populate("producto", "nombre precio");
    res.json({ success: true, data: resenas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//Reseñas de un producto específico
export const resenasDeProducto = async (req, res) => {
  try {
    const { productId } = req.params;
    const resenas = await Review.find({ producto: productId })
      .populate("usuario", "nombre")
      .sort({ fecha: -1 });
    res.json({ success: true, data: resenas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Promedio de calificaciones por producto
export const promedioResenas = async (req, res) => {
  try {
    const top = await Review.aggregate([
      {
        $group: {
          _id: "$producto",
          promedio: { $avg: "$calificacion" },
          cantidad: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "producto"
        }
      },
      { $unwind: "$producto" },
      {
        $project: {
          _id: 0,
          producto: "$producto.nombre",
          promedio: { $round: ["$promedio", 2] },
          cantidad: 1
        }
      },
      { $sort: { promedio: -1 } },
      { $limit: 5 }
    ]);

    res.json({ success: true, data: top });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
