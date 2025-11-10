import express from "express";
import {
  crearPedido,
  listarPedidos,
  obtenerPedido,
  actualizarEstado,
  eliminarPedido,
  listarPedidosPorUsuario,
  estadisticasPedidos,
  filtrarPedidosPorEstado
} from "../controllers/orderController.js";
import { verificarToken, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cliente autenticado
router.post("/", verificarToken, crearPedido);
router.get("/usuario/:id", verificarToken, listarPedidosPorUsuario);

// Admin
router.get("/", verificarToken, soloAdmin, listarPedidos);
router.get("/estadisticas/general", verificarToken, soloAdmin, estadisticasPedidos);
router.get("/filtrar", verificarToken, soloAdmin, filtrarPedidosPorEstado);
router.put("/:id", verificarToken, soloAdmin, actualizarEstado);
router.delete("/:id", verificarToken, soloAdmin, eliminarPedido);

export default router;
