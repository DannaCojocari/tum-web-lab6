import { db } from "../config/db.js";
import { destinations } from "../db/schema.js";
import { eq, count, asc } from "drizzle-orm";

const PUBLIC_DESTINATIONS = [
  { id: 1001, name: "Santorini", country: "Greece", continent: "Europe", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", tags: ["Beach", "City"], description: "Beautiful white houses and blue domes overlooking the Aegean Sea", status: "Wishlist", liked: false, rating: 0 },
  { id: 1002, name: "Kyoto", country: "Japan", continent: "Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", tags: ["Culture", "Nature"], description: "Traditional temples and cherry blossoms in ancient Japan", status: "Wishlist", liked: false, rating: 0 },
  { id: 1003, name: "Machu Picchu", country: "Peru", continent: "America", image: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee", tags: ["Adventure", "Mountains"], description: "Ancient Incan city perched high in the Andes mountains", status: "Wishlist", liked: false, rating: 0 },
  { id: 1004, name: "Bali", country: "Indonesia", continent: "Asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4", tags: ["Beach", "Nature", "Culture"], description: "Tropical paradise with lush rice terraces and sacred temples", status: "Wishlist", liked: true, rating: 0 },
  { id: 1005, name: "Banff", country: "Canada", continent: "America", image: "https://images.unsplash.com/photo-1502101872923-d48509bff386", tags: ["Mountains", "Nature", "Adventure"], description: "Stunning turquoise lakes in the Canadian Rockies", status: "Wishlist", liked: false, rating: 0 },
  { id: 1006, name: "Marrakech", country: "Morocco", continent: "Africa", image: "https://images.unsplash.com/photo-1597211684565-dca64d72bdfe", tags: ["Culture", "City", "Food"], description: "Vibrant souks, ornate palaces and the magic of the medina", status: "Wishlist", liked: false, rating: 0 },
  { id: 1007, name: "Serengeti", country: "Tanzania", continent: "Africa", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801", tags: ["Adventure", "Nature"], description: "Witness the greatest wildlife spectacle on Earth", status: "Wishlist", liked: false, rating: 0 },
  { id: 1008, name: "Maldives", country: "Maldives", continent: "Asia", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", tags: ["Beach", "Nature"], description: "Overwater bungalows above crystal clear lagoons in the Indian Ocean", status: "Wishlist", liked: false, rating: 0 },
  { id: 1009, name: "Ha Long Bay", country: "Vietnam", continent: "Asia", image: "https://images.unsplash.com/photo-1528127269322-539801943592", tags: ["Nature", "Adventure", "Beach"], description: "Thousands of limestone karsts rising from emerald green waters", status: "Wishlist", liked: false, rating: 0 },
  { id: 1010, name: "Patagonia", country: "Argentina", continent: "America", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b", tags: ["Adventure", "Mountains", "Nature"], description: "Raw wilderness at the end of the world with dramatic glaciers", status: "Wishlist", liked: false, rating: 0 },
];

// DELETE /api/destinations/demo/:id — requires JWT with DELETE permission, demo only
export const deleteDemo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = PUBLIC_DESTINATIONS.find((d) => d.id === id);

    if (!exists) {
      return res.status(404).json({ error: "Demo destination not found" });
    }

    // Don't actually delete anything — this is a demo endpoint
    res.json({ message: `Demo: destination ${id} (${exists.name}) would be deleted` });
  } catch (err) {
    next(err);
  }
};

// GET /api/destinations/demo — requires JWT but no userId
export const getDemo = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const paginated = PUBLIC_DESTINATIONS.slice(offset, offset + limit);
    const total = PUBLIC_DESTINATIONS.length;

    res.json({
      data: paginated,
      pagination: { limit, offset, total },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/destinations/public — no auth required
export const getPublic = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const paginated = PUBLIC_DESTINATIONS.slice(offset, offset + limit);
    const total = PUBLIC_DESTINATIONS.length;

    res.json({
      data: paginated,
      pagination: { limit, offset, total },
    });
  } catch (err) {
    next(err);
  }
};

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