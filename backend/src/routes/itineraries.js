import { Router } from "express";
import { authenticate, requirePermission } from "../middleware/auth.js";
import { getAll, create, remove } from "../controllers/itinerariesController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Itineraries
 *   description: Day-by-day itinerary management
 */

/**
 * @swagger
 * /api/itineraries:
 *   get:
 *     summary: Get itinerary days for a destination
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: destinationId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of itinerary days with activities
 */
router.get("/", authenticate, getAll);

/**
 * @swagger
 * /api/itineraries:
 *   post:
 *     summary: Create a new itinerary day
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destinationId, day]
 *             properties:
 *               destinationId:
 *                 type: integer
 *               day:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created itinerary day
 */
router.post("/", authenticate, requirePermission("WRITE"), create);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   delete:
 *     summary: Delete an itinerary day
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete("/:id", authenticate, requirePermission("DELETE"), remove);

export default router;