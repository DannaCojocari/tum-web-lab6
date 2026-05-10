import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { users, destinations } from "../db/schema.js";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

const DEFAULT_DESTINATIONS = [
  {
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    tags: ["Beach", "City"],
    description: "Beautiful white houses and blue domes overlooking the Aegean Sea",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    tags: ["Culture", "Nature"],
    description: "Traditional temples and cherry blossoms in ancient Japan",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    continent: "America",
    image: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee",
    tags: ["Adventure", "Mountains"],
    description: "Ancient Incan city perched high in the Andes mountains",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    tags: ["Beach", "Nature", "Culture"],
    description: "Tropical paradise with lush rice terraces and sacred temples",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Banff",
    country: "Canada",
    continent: "America",
    image: "https://images.unsplash.com/photo-1502101872923-d48509bff386",
    tags: ["Mountains", "Nature", "Adventure"],
    description: "Stunning turquoise lakes and snow-capped peaks in the Canadian Rockies",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Patagonia",
    country: "Argentina",
    continent: "America",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    tags: ["Adventure", "Mountains", "Nature"],
    description: "Raw wilderness at the end of the world with dramatic glaciers and peaks",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Serengeti",
    country: "Tanzania",
    continent: "Africa",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    tags: ["Adventure", "Nature"],
    description: "Witness the greatest wildlife spectacle on Earth in the open savanna",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Maldives",
    country: "Maldives",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
    tags: ["Beach", "Nature"],
    description: "Overwater bungalows above crystal clear lagoons in the Indian Ocean",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
  {
    name: "Ha Long Bay",
    country: "Vietnam",
    continent: "Asia",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592",
    tags: ["Nature", "Adventure", "Beach"],
    description: "Thousands of limestone karsts rising from emerald green waters",
    status: "Wishlist",
    liked: false,
    rating: 0,
    review: "",
  },
];

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "firstName, lastName, username, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const rows = await db
      .insert(users)
      .values({ firstName, lastName, username, email, password: hashedPassword })
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      });

    const user = rows[0];

    // Seed default destinations for new user
    await db.insert(destinations).values(
      DEFAULT_DESTINATIONS.map((d) => ({ ...d, userId: user.id }))
    );

    // Sign JWT — unique per user and login time via iat
    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: "USER",
        permissions: ["READ", "WRITE", "DELETE"],
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // Find user
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Sign JWT — iat (issued at) is always different so every login = unique token
    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: "USER",
        permissions: ["READ", "WRITE", "DELETE"],
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const me = async (req, res, next) => {
  try {
    const rows = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user.userId));

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};