import { pgTable, serial, text, boolean, integer, timestamp, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // bcrypt hashed
  createdAt: timestamp("created_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  tags: json("tags").$type().default([]),
  status: text("status").notNull().default("Wishlist"), // Wishlist | Planned | Visited
  liked: boolean("liked").default(false),
  rating: integer("rating").default(0),
  review: text("review").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  done: boolean("done").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});