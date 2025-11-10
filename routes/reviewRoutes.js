import express from "express";
import {
  crearResena,
  listarResenas,
  resenasDeProducto,
  promedioResenas
} from "../controllers/reviewController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Públicas
router.get("/", listarResenas);
router.get("/product/:productId", resenasDeProducto);
router.get("/top", promedioResenas);

// Protegida (requiere login)
router.post("/", verificarToken, crearResena);

export default router;
