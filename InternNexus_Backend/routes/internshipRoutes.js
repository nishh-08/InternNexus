import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { createInternship, getAllInternships,searchInternships,deleteInternship, getMyInternships } from "../controllers/internshipController.js";


const router = express.Router();

// Only companies can create internships
router.post("/create", verifyToken, checkRole(["company"]), createInternship);

// Search and filter internships
router.get("/search", verifyToken, searchInternships);

//company get thier internships
router.get("/mine", verifyToken, checkRole(["company"]), getMyInternships);

// Anyone logged in can view internships
router.get("/", verifyToken, getAllInternships);

// Company deletes internship
router.delete("/:id", verifyToken, checkRole(["company"]), deleteInternship);

 


export default router;