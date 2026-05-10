import Dexie from "dexie";

const db = new Dexie("WanderlistPhotos");

db.version(1).stores({
  photos: "++id, destinationId, data, createdAt",
});

// Get all photos for a destination
export const getPhotos = async (destinationId) => {
  return await db.photos
    .where("destinationId")
    .equals(destinationId)
    .toArray();
};

// Add a photo for a destination
export const addPhoto = async (destinationId, data) => {
  return await db.photos.add({
    destinationId,
    data,
    createdAt: new Date().toISOString(),
  });
};

// Delete a photo by id
export const deletePhoto = async (id) => {
  return await db.photos.delete(id);
};

export default db;