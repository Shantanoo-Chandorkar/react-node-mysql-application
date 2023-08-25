import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(`Token from authMiddleware: ${token}`);
  try {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Authorizzed!");
        next();
      } catch (error) {
        res.status(401).json({ error: "Not authorized, invalid token" });
      }
    } else {
      res.status(401).json({ error: "Not authorized, invalid token" });
    }
  } catch (error) {
    res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

export { protect };
