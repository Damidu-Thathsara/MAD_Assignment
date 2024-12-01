import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  try {
    const db = await open({
      filename: "./data.db",
      driver: sqlite3.Database,
    });

    // Create the users table if it doesn't exist, with a username field
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    console.log("Database initialized successfully.");
    return db;
  } catch (error) {
    console.error("Error initializing the database:", (error as any).message);
    throw error;
  }
};

export default initDB;
