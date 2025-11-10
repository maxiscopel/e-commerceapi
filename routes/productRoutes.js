import express from "express";
import {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
  filtrarProductos,
  productosTop,
  actualizarStock
} from "../controllers/productController.js";
import { verificarToken, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", listarProductos);
router.get("/filtrar", filtrarProductos);
router.get("/top", productosTop);
router.get("/:id", obtenerProducto);

// Rutas protegidas (solo admin)
router.post("/", verificarToken, soloAdmin, crearProducto);
router.put("/:id", verificarToken, soloAdmin, actualizarProducto);
router.delete("/:id", verificarToken, soloAdmin, eliminarProducto);
router.put("/stock/:id", verificarToken, soloAdmin, actualizarStock);
router.patch("/:id/stock", actualizarStock);


export default router;
