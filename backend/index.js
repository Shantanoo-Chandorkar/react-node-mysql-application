import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();
const port = process.env.PORT || 8800;

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send(`Server is listening`));
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is connected" });
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
