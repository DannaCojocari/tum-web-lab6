import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * @swagger
 * /api/token:
 *   post:
 *     summary: Get a demo JWT token with permissions (expires in 1 minute)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *         description: permissions required
 */
router.post("/", (req, res) => {
  const { permissions } = req.body;

  if (!permissions) {
    return res.status(400).json({ error: "Provide permissions array" });
  }

  const token = jwt.sign({ permissions }, process.env.JWT_SECRET, { expiresIn: "1m" });
  res.json({ token });
});

/**
 * @swagger
 * /api/token:
 *   get:
 *     summary: Get a demo JWT token via query params (expires in 1 minute)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: permissions
 *         schema:
 *           type: string
 *         example: READ,WRITE,DELETE
 *     responses:
 *       200:
 *         description: JWT token issued
 *       400:
 *         description: permissions required
 */
router.get("/", (req, res) => {
  const { permissions } = req.query;

  if (!permissions) {
    return res.status(400).json({ error: "Provide permissions as query param" });
  }

  const token = jwt.sign(
    { permissions: permissions.split(",") },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );
  res.json({ token });
});

export default router;