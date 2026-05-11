import { Router } from "express";
import { authenticate, requirePermission } from "../middleware/auth.js";
import {
  getAll,
  getOne,
  getPublic,
  getDemo,
  deleteDemo,
  create,
  update,
  remove,
} from "../controllers/destinationsController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Destination management
 */

/**
 * @swagger
 * /api/destinations/public:
 *   get:
 *     summary: Get public default destinations (no auth required)
 *     tags: [Destinations]
 *     parameters:
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
 *         description: Paginated list of default destinations
 */
router.get("/public", getPublic);

/**
 * @swagger
 * /api/destinations/demo:
 *   get:
 *     summary: Demo endpoint — requires JWT with READ permission, no userId needed
 *     description: Use this to test JWT authentication and pagination in Swagger. Get a token from /api/token first.
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Paginated list of demo destinations
 *       401:
 *         description: Unauthorized — token missing or expired
 *       403:
 *         description: Forbidden — missing READ permission
 */
router.get("/demo", authenticate, requirePermission("READ"), getDemo);

/**
 * @swagger
 * /api/destinations/demo/{id}:
 *   delete:
 *     summary: Demo delete — requires JWT with DELETE permission, doesn't actually delete anything
 *     description: Use this to test DELETE permission in Swagger. Get a token from /api/token first.
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1001
 *     responses:
 *       200:
 *         description: Demo delete successful (nothing actually deleted)
 *       401:
 *         description: Unauthorized — token missing or expired
 *       403:
 *         description: Forbidden — missing DELETE permission
 */
router.delete("/demo/:id", authenticate, requirePermission("DELETE"), deleteDemo);

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Get all destinations (paginated)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Paginated list of destinations
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getAll);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Get a destination by ID
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Destination object
 *       404:
 *         description: Not found
 */
router.get("/:id", authenticate, getOne);

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Create a new destination
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, country, continent, description]
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               continent:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Wishlist, Planned, Visited]
 *     responses:
 *       201:
 *         description: Created destination
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, requirePermission("WRITE"), create);

/**
 * @swagger
 * /api/destinations/{id}:
 *   patch:
 *     summary: Update a destination
 *     tags: [Destinations]
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
 *     responses:
 *       200:
 *         description: Updated destination
 *       404:
 *         description: Not found
 */
router.patch("/:id", authenticate, requirePermission("WRITE"), update);

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Delete a destination
 *     tags: [Destinations]
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
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete("/:id", authenticate, requirePermission("DELETE"), remove);

export default router;