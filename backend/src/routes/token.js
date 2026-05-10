import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * @swagger
 * /api/token:
 *   post:
 *     summary: Get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, WRITER, VISITOR]
 *                 example: ADMIN
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["READ", "WRITE", "DELETE"]
 *     responses:
 *       200:
 *         description: JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: role or permissions required
 */
router.post("/", (req, res) => {
  const { role, permissions } = req.body;

  if (!role && !permissions) {
    return res.status(400).json({ error: "Provide role or permissions" });
  }

  const payload = {};
  if (role) payload.role = role;
  if (permissions) payload.permissions = permissions;

  // For demo: expires in 1 minute as per lab requirement
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m" });

  res.json({ token });
});

export default router;