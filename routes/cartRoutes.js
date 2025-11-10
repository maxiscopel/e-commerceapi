import express from "express";
import {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  calcularTotal
} from "../controllers/cartController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas protegidas (usuario logueado)
router.get("/:usuarioId", verificarToken, obtenerCarrito);
router.post("/:usuarioId", verificarToken, agregarAlCarrito);
router.delete("/:usuarioId/:productoId", verificarToken, eliminarDelCarrito);
router.get("/:usuarioId/total", verificarToken, calcularTotal);

export default router;
