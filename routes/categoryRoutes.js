import express from "express";
import {
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
  estadisticasCategorias
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", crearCategoria);
router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);
router.put("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);
router.get("/stats/cantidad", estadisticasCategorias);

export default router;
