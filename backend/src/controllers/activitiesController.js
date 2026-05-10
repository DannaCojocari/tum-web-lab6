import { db } from "../config/db.js";
import { activities } from "../db/schema.js";
import { eq } from "drizzle-orm";

// POST /api/activities
export const create = async (req, res, next) => {
  try {
    const { itineraryId, text } = req.body;

    if (!itineraryId || !text) {
      return res.status(400).json({ error: "itineraryId and text are required" });
    }

    const rows = await db
      .insert(activities)
      .values({ itineraryId, text, done: false })
      .returning();

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/activities/:id
export const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { text, done } = req.body;

    const rows = await db
      .update(activities)
      .set({ ...(text !== undefined && { text }), ...(done !== undefined && { done }) })
      .where(eq(activities.id, id))
      .returning();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/activities/:id
export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const rows = await db
      .delete(activities)
      .where(eq(activities.id, id))
      .returning();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};