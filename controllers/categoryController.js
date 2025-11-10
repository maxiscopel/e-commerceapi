import Category from "../models/category.js";
import Product from "../models/Product.js";

// Crear categoría
export const crearCategoria = async (req, res) => {
  try {
    const categoria = await Category.create(req.body);
    res.status(201).json({ success: true, data: categoria });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Listar todas las categorías
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Category.find();
    res.json({ success: true, data: categorias });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener una categoría por ID
export const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ success: true, data: categoria });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ success: true, data: categoria });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ success: true, message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Estadísticas: cantidad de productos por categoría
export const estadisticasCategorias = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$categoria",
          cantidadProductos: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "category", // 🔧 antes tenías "categories"
          localField: "_id",
          foreignField: "_id",
          as: "categoria"
        }
      },
      { $unwind: "$categoria" },
      {
        $project: {
          _id: 0,
          categoria: "$categoria.nombre",
          cantidadProductos: 1
        }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

