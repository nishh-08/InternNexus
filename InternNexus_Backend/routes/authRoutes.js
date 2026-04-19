import express from "express";
import { registerUser,loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();


// POST /api/auth/register
router.post("/register", registerUser);

// POST/api/auth/login
router.post("/login",loginUser);

// protected test route

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});
export default router;