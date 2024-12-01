import initDB from "../database";

export const createUser = async (username: string, email: string, password: string) => {
  const db = await initDB();
  await db.run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );
};

export const getUserByEmail = async (email: string) => {
  const db = await initDB();
  return db.get("SELECT * FROM users WHERE email = ?", [email]);
};

export const getUserByUsername = async (username: string) => {
  const db = await initDB();
  return db.get("SELECT * FROM users WHERE username = ?", [username]);
};
