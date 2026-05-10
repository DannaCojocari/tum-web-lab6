import { db } from "../config/db.js";
import { destinations } from "../db/schema.js";
import { eq, count } from "drizzle-orm";

// GET /api/destinations?limit=10&offset=0
export const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.user.userId;

    const rows = await db
      .select()
      .from(destinations)
      .where(eq(destinations.userId, userId))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: count() })
      .from(destinations)
      .where(eq(destinations.userId, userId));

    const total = totalResult[0]?.count ?? 0;

    res.json({
      data: rows,
      pagination: { limit, offset, total },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/destinations/:id
export const getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, id));

    if (rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/destinations
export const create = async (req, res, next) => {
  try {
    const { name, country, continent, description, image, tags, status, liked, rating, review } = req.body;
    const userId = req.user.userId;

    if (!name || !country || !continent || !description) {
      return res.status(400).json({ error: "name, country, continent, description are required" });
    }

    const rows = await db
      .insert(destinations)
      .values({ userId, name, country, continent, description, image, tags, status, liked, rating, review })
      .returning();

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/destinations/:id
export const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const fields = req.body;

    const rows = await db
      .update(destinations)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(destinations.id, id))
      .returning();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/destinations/:id
export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const rows = await db
      .delete(destinations)
      .where(eq(destinations.id, id))
      .returning();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};