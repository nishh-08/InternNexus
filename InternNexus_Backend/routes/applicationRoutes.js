import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  applyToInternship,
  getStudentApplications,
  getCompanyApplications
} from "../controllers/applicationController.js";

const router = express.Router();

// Student applies to internship
router.post("/apply", verifyToken, checkRole(["student"]), applyToInternship);

// Student views their applications
router.get("/student", verifyToken, checkRole(["student"]), getStudentApplications);

// Company views applicants
router.get("/company", verifyToken, checkRole(["company"]), getCompanyApplications);

export default router;