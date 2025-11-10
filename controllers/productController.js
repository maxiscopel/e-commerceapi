import Product from "../models/Product.js";
import mongoose from "mongoose";

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const producto = await Product.create(req.body);
    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Listar todos los productos con su categoría
export const listarProductos = async (req, res) => {
  try {
    const productos = await Product.find().populate("categoria", "nombre descripcion");
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un producto por ID
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id).populate("categoria", "nombre descripcion");
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar producto (PUT)
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔍 Filtrar por rango de precio y marca
export const filtrarProductos = async (req, res) => {
  try {
    const { min, max, marca } = req.query;
    const filtro = {
      precio: { $gte: Number(min) || 0, $lte: Number(max) || 999999 },
    };
    if (marca) filtro.marca = { $regex: marca, $options: "i" };

    const productos = await Product.find(filtro);
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ⭐ Productos más reseñados
export const productosTop = async (req, res) => {
  try {
    const top = await Product.aggregate([
      { $project: { nombre: 1, cantidadReseñas: { $size: "$reseñas" } } },
      { $sort: { cantidadReseñas: -1 } },
      { $limit: 5 }
    ]);
    res.json({ success: true, data: top });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔧 Actualizar stock
export const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const producto = await Product.findByIdAndUpdate(
      id,
      { $set: { stock } },
      { new: true }
    );

    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
