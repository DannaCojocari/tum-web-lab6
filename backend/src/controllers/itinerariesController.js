import { db } from "../config/db.js";
import { itineraries, activities } from "../db/schema.js";
import { eq } from "drizzle-orm";

// GET /api/itineraries?destinationId=1
export const getAll = async (req, res, next) => {
  try {
    const destinationId = parseInt(req.query.destinationId);
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    if (!destinationId) {
      return res.status(400).json({ error: "destinationId query param is required" });
    }

    const rows = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.destinationId, destinationId))
      .limit(limit)
      .offset(offset);

    // Attach activities to each itinerary day
    const result = await Promise.all(
      rows.map(async (row) => {
        const acts = await db
          .select()
          .from(activities)
          .where(eq(activities.itineraryId, row.id));
        return { ...row, activities: acts };
      })
    );

    res.json({ data: result, pagination: { limit, offset } });
  } catch (err) {
    next(err);
  }
};

// POST /api/itineraries
export const create = async (req, res, next) => {
  try {
    const { destinationId, day } = req.body;

    if (!destinationId || !day) {
      return res.status(400).json({ error: "destinationId and day are required" });
    }

    const rows = await db
      .insert(itineraries)
      .values({ destinationId, day })
      .returning();

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/itineraries/:id
export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const rows = await db
      .delete(itineraries)
      .where(eq(itineraries.id, id))
      .returning();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};