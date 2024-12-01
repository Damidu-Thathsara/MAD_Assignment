import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, getUserByUsername } from "../models/userModels";

// Use environment variables for sensitive data
const SECRET_KEY = "secretkey";

// Email validation regex
const emailRegex = /\S+@\S+\.\S+/;
const usernameRegex = /^[a-zA-Z0-9_]+$/; // Example regex for username validation


export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Basic validation for username and email
    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Please provide a valid email address." });
        return;
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, email, hashedPassword);

        res.status(201).json({ message: "User registered successfully." });
        console.log("User registered successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during signup." });
    }
};


export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required." });
        return;
    }

    // Username validation
    if (!usernameRegex.test(username)) {
        res.status(400).json({ message: "Please provide a valid username." });
        return;
    }

    try {
        // Check if the user exists by username
        const user = await getUserByUsername(username);
        if (!user) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }

        // Check if the password matches
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.status(200).json({
            token,
            message: "User logged in successfully.",
        });
        console.log("User logged in successfully.");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};