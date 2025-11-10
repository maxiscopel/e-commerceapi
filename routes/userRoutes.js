import express from "express";
import { registrarUsuario, loginUsuario, listarUsuarios, obtenerUsuario, eliminarUsuario } from "../controllers/userController.js";
import { verificarToken, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registro y login (públicos)
router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);

// Rutas solo para admin
router.get("/", verificarToken, soloAdmin, listarUsuarios);
router.get("/:id", verificarToken, soloAdmin, obtenerUsuario);
router.delete("/:id", verificarToken, soloAdmin, eliminarUsuario);

export default router;
