import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// 🛒 Obtener carrito de un usuario
export const obtenerCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Cart.findOne({ usuario: usuarioId })
      .populate("items.producto", "nombre precio");
    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    res.json({ success: true, data: carrito });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➕ Agregar producto(s) al carrito
export const agregarAlCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { items } = req.body; // ahora toma items como array

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debes enviar al menos un producto en items[]",
      });
    }

    let carrito = await Cart.findOne({ usuario: usuarioId });

    if (!carrito) {
      
      carrito = await Cart.create({ usuario: usuarioId, items });
    } else {
   
      for (const item of items) {
        const index = carrito.items.findIndex(
          (i) => i.producto.toString() === item.producto
        );
        if (index > -1) {
          carrito.items[index].cantidad += item.cantidad;
        } else {
          carrito.items.push(item);
        }
      }
      await carrito.save();
    }

    res.json({ success: true, data: carrito });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: error.message });
  }
};


//  Eliminar producto del carrito
export const eliminarDelCarrito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    const carrito = await Cart.findOneAndUpdate(
      { usuario: usuarioId },
      { $pull: { items: { producto: productoId } } },
      { new: true }
    );

    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    res.json({ success: true, data: carrito });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Calcular total del carrito
export const calcularTotal = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Cart.findOne({ usuario: usuarioId }).populate("items.producto", "precio nombre");
    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    let total = 0;
    const detalles = carrito.items.map((item) => {
      const subtotal = item.producto.precio * item.cantidad;
      total += subtotal;
      return {
        producto: item.producto.nombre,
        cantidad: item.cantidad,
        subtotal
      };
    });

    res.json({ success: true, data: { total, detalles } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
