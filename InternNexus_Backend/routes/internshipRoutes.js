import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { createInternship, getAllInternships,searchInternships } from "../controllers/internshipController.js";


const router = express.Router();

// Only companies can create internships
router.post("/create", verifyToken, checkRole(["company"]), createInternship);

// Anyone logged in can view internships
router.get("/", verifyToken, getAllInternships);

// Search and filter internships
router.get("/search", verifyToken, searchInternships);

export default router;