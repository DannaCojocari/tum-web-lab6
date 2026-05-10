import jwt from "jsonwebtoken";

// Verifies JWT token from Authorization header
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { role, permissions, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
};

// Role-based guard — usage: requireRole("ADMIN")
export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: "Forbidden: insufficient role" });
  }
  next();
};

// Permission-based guard — usage: requirePermission("WRITE")
export const requirePermission = (permission) => (req, res, next) => {
  if (!req.user || !req.user.permissions?.includes(permission)) {
    return res.status(403).json({ error: `Forbidden: missing ${permission} permission` });
  }
  next();
};