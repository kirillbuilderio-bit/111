import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Simple admin password - in production, use environment variable
const ADMIN_PASSWORD = "rsgs_admin_2024";
const JWT_SECRET = process.env.JWT_SECRET || "rsgs_jwt_secret_key_2024";

export interface AuthRequest extends Request {
  user?: any;
}

// Admin login
export const adminLogin: RequestHandler = (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: "Пароль обязателен"
    });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: "Неверный пароль"
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      role: 'admin',
      timestamp: Date.now()
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    message: "Успешный вход в админ панель"
  });
};

// Verify admin token
export const verifyAdmin: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: "Токен авторизации не предоставлен"
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      error: "Недействительный токен"
    });
  }
};

// Middleware to protect admin routes
export const requireAdmin: RequestHandler = (req: any, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: "Доступ запрещен. Требуется авторизация админа."
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Недействительный токен авториз��ции"
    });
  }
};

// Get admin info
export const getAdminInfo: RequestHandler = (req: any, res) => {
  res.json({
    user: req.user,
    permissions: ['content_management', 'user_management', 'server_management']
  });
};
