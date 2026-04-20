import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  applyToInternship,
  getStudentApplications,
  getCompanyApplications,
  updateApplicationStatus,
   deleteApplication
} from "../controllers/applicationController.js";


const router = express.Router();
console.log("Application routes loaded"); 
// TEMP TEST ROUTE - no middleware
router.patch("/test/:id", (req, res) => {
  res.json({ message: "patch works", id: req.params.id });
});

// Student applies to internship
router.post("/apply", verifyToken, checkRole(["student"]), applyToInternship);

// Student views their applications
router.get("/student", verifyToken, checkRole(["student"]), getStudentApplications);

// Company views applicants
router.get("/company", verifyToken, checkRole(["company"]), getCompanyApplications);

// Company accepts or rejects application
router.patch("/:id/status", verifyToken, checkRole(["company"]), updateApplicationStatus);

// student withdraws application
router.delete("/:id", verifyToken, checkRole(["student"]), deleteApplication);

export default router;

