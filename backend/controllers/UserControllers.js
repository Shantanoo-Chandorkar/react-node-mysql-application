import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../db.js";
import { passwordSchema } from "../utils/PasswordValidator.js";
import emailValidator from "email-validator";

dotenv.config();

const revokedTokens = new Set(); // Store revoked tokens
console.log(revokedTokens);

// @desc Register function
// POST /api/users/register
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Please fill all the details." });
    }

    // Check password complexity
    if (!isPasswordComplex(password) && !passwordSchema.validate(password)) {
      return res.status(400).json({
        error:
          "Password should contain at least 8 characters including uppercase, lowercase, and special characters",
      });
    }

    // Validate email using email-validator
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if the Email is already taken
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [email, hashedPassword, username],
      (err, result) => {
        if (err) {
          // console.error(err);
          res.status(500).json({ error: "Error registering user" });
        } else {
          // console.log(result);
          res.status(201).json({ message: "User registered successfully." });
        }
      }
    );
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
};

// @desc Login function
// POST /api/users/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const userId = user.id;
      // Generate a JWT
      const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      // Set the JWT as a cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      // console.log(`Token from login: ${token}`);
      const { password, ...other } = user;
      // console.log("You have logged in successfully");
      res.status(200).json({ other });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};

// @desc Logout function
// POST /api/users/logout
export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
};

// @desc Delete function
// DELETE /api/users/delete
export const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const userEmail = user.email;

    db.query(
      "DELETE FROM users WHERE email = ?",
      [userEmail],
      async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          // console.log(`User deleted with this data: ${result}`);
          return res
            .status(200)
            .json({ message: "User deleted successfully." });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Protected route for token verification & Authorization
// GET /api/users/protected
export const protectedRoute = async (req, res, next) => {
  // Set Content Security Policy header
  // res.setHeader("Content-Security-Policy", "default-src 'self'");

  const token = req.cookies.jwt;
  console.log(`Token from protectedRoute: ${token}`);
  if (!token) {
    console.log("Unauthorized from backend");
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.error(err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }

    if (revokedTokens.has(token)) {
      return res.status(401).json({ error: "Token revoked" });
    }

    // res.json({ message: "Protected resource accessed" });
    console.log("Authorizzed!");
    next();
  });
};

export const getMealCart = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.jwt;
  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const userId = user.userId; // Update to match your user ID property

    // Fetch the meal cart data from the database
    const [results] = await db
      .promise()
      .query("SELECT * FROM meal_cart WHERE user_id = ?", [userId]);

    // Send the meal cart data back in the response
    return res.status(200).json(results);
  } catch (error) {
    console.error("User Fetching Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addToMealCart = async (req, res) => {
  const { id } = req.params;
  const { strMeal, strMealThumb, idMeal } = req.body;

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const userId = user.userId; // Update to match your user ID property

    const [mealExists] = await db
      .promise()
      .query("SELECT * FROM meal_cart WHERE mealName = ?", [strMeal]);

    db.query(
      "INSERT INTO meal_cart (mealName, mealImg, user_id, mealFetchId) VALUES (?, ?, ?, ?)",
      [strMeal, strMealThumb, userId, idMeal],
      async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error adding meal to the cart" });
        } else {
          const [results] = await db
            .promise()
            .query("SELECT * FROM meal_cart WHERE user_id = ?", [userId]);
          return res.status(200).json(results);
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteFromMealCart = async (req, res) => {
  const { id } = req.params;

  const { strMeal } = req.body;

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const userId = user.userId; // Update to match your user ID property

    const response = await db
      .promise()
      .query("DELETE FROM meal_cart WHERE (mealName = ? && user_id = ?)", [
        strMeal,
        userId,
      ]);

    if (response[0].affectedRows === 0) {
      return res.status(404).json({ message: "Meal not found." });
    }

    const [results] = await db
      .promise()
      .query("SELECT * FROM meal_cart WHERE user_id = ?", [userId]);
    return res.status(200).json(results);
  } catch (error) {
    // console.error("User Fetching Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to check if users exist
async function getUserByEmail(email) {
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    return results[0];
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM users WHERE userId = ?", [id]);
    // console.log(`From getUserById where users: ${results[0]}`);
    return results[0];
  } catch (error) {
    throw error;
  }
}

// Function to check password complexity
function isPasswordComplex(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}
