import { Router } from "express";
import { authenticate, requirePermission } from "../middleware/auth.js";
import { create, update, remove } from "../controllers/activitiesController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Itinerary activity management
 */

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Add an activity to an itinerary day
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itineraryId, text]
 *             properties:
 *               itineraryId:
 *                 type: integer
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created activity
 */
router.post("/", authenticate, requirePermission("WRITE"), create);

/**
 * @swagger
 * /api/activities/{id}:
 *   patch:
 *     summary: Update an activity (text or done status)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated activity
 */
router.patch("/:id", authenticate, requirePermission("WRITE"), update);

/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [Activities]
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