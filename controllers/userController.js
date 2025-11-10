import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "El email ya está registrado" });

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await User.create({ nombre, email, password: hash });

    res.status(201).json({ success: true, data: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Listar todos los usuarios (para admin)
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener usuario por ID (para admin)
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar usuario (para admin)
export const eliminarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
