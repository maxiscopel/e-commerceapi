import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado; // guarda los datos del usuario (id, rol, etc.)
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido o expirado." });
  }
};

// Middleware adicional solo para admin
export const soloAdmin = (req, res, next) => {
  if (req.user?.rol !== "admin") {
    return res.status(403).json({ success: false, message: "Acceso denegado. Solo administradores." });
  }
  next();
};
