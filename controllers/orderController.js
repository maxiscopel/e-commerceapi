import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Crear pedido
export const crearPedido = async (req, res) => {
  try {
    const { usuario, productos } = req.body;

    // Calcular total sumando los precios * cantidades
    let total = 0;
    for (const item of productos) {
      const prod = await Product.findById(item.producto);
      if (prod) total += prod.precio * item.cantidad;
    }

    const pedido = await Order.create({ usuario, productos, total });
    res.status(201).json({ success: true, data: pedido });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Listar todos los pedidos
export const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Order.find()
      .populate("usuario", "nombre email")
      .populate("productos.producto", "nombre precio");
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener un pedido por ID
export const obtenerPedido = async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id)
      .populate("usuario", "nombre email")
      .populate("productos.producto", "nombre precio");
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar estado de pedido
export const actualizarEstado = async (req, res) => {
  try {
    const pedido = await Order.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Order.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ success: true, message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Listar pedidos por usuario
export const listarPedidosPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidos = await Order.find({ usuario: id })
      .populate("productos.producto", "nombre precio")
      .populate("usuario", "nombre email");
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Estadísticas de ventas
export const estadisticasPedidos = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$estado",
          totalPedidos: { $sum: 1 },
          totalVentas: { $sum: "$total" }
        }
      },
      { $sort: { totalVentas: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Filtrar pedidos por estado
export const filtrarPedidosPorEstado = async (req, res) => {
  try {
    const { estado } = req.query;
    const pedidos = await Order.find({ estado })
      .populate("usuario", "nombre email")
      .populate("productos.producto", "nombre precio");
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
