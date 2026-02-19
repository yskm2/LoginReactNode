import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js"; // Importa el middleware de protección

const router = express.Router();

// Opciones de configuración para las cookies de sesión
const cookieOptions = {
  // Hace que la cookie solo sea accesible por el servidor (protección XSS)
  httpOnly: true,
  // Solo enviar la cookie sobre HTTPS en producción
  secure: process.env.NODE_ENV === "production",
  // Controla cómo se envía la cookie en peticiones de terceros (Strict para producción, Lax en dev)
  sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
  // Tiempo de vida de la cookie (30 días)
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

/**
 * Función de utilidad para generar un JWT.
 * Se ha corregido el nombre de 'genereteToken' a 'generateToken'.
 * @param {number} id - ID del usuario a incluir en el payload.
 * @returns {string} El token JWT generado.
 */
const generateToken = (id) => {
  // Se asume que process.env.JWT_SECRET está correctamente cargado por dotenv
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // El token expira en 30 días
  });
};

// ====================================================================
// RUTAS
// ====================================================================

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, proporcione todos los campos requeridos (nombre, email, contraseña)." });
  }
  
  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El usuario con este correo electrónico ya existe." });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario en la base de datos
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // Generar el token (corregido)
    const token = generateToken(newUser.rows[0].id);

    // Establecer el token como cookie de respuesta
    res.cookie("token", token, cookieOptions);

    // Responder con los datos del usuario (sin contraseña)
    return res.status(201).json({ 
        user: newUser.rows[0],
        message: "Registro exitoso."
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor durante el registro." });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión de usuario
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, proporcione email y contraseña." });
  }

  try {
    // Buscar el usuario por email
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const userData = user.rows[0];

    // Comparar la contraseña hasheada
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Generar el token (corregido)
    const token = generateToken(userData.id);

    // Establecer el token como cookie de respuesta
    res.cookie("token", token, cookieOptions);

    // Responder con los datos del usuario (sin contraseña)
    res.json({
      user: { 
        id: userData.id, 
        name: userData.name, 
        email: userData.email 
      },
      message: "Inicio de sesión exitoso."
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor durante el inicio de sesión." });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener detalles del usuario autenticado
// @access  Private (requiere token)
router.get("/me", protect, async (req, res) => {
    // req.user es poblado por el middleware 'protect' después de verificar el token
    // y buscar el usuario en la base de datos.
    res.json(req.user);
});

// @route   POST /api/auth/logout
// @desc    Cerrar sesión (eliminar cookie)
// @access  Public (solo elimina la cookie si existe)
router.post("/logout", (req, res) => {
  // Sobrescribir la cookie con un valor vacío y un maxAge de 1ms para forzar su expiración
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Sesión cerrada con éxito." });
});

export default router;