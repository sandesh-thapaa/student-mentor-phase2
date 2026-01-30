import { Router } from "express";
import {
  getMentorDashboard,
  getMentorStudents,
  assignTaskToStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getMentorAssignments,
  reviewAssignment,
} from "../controller/mentor.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/dashboard", getMentorDashboard);
router.get("/students", getMentorStudents);
router.post("/tasks/assign", assignTaskToStudent);
router.post("/students", createStudent);
router.put("/students/:studentId", updateStudent);
router.delete("/students/:studentId", deleteStudent);
router.get("/assignments", getMentorAssignments);
router.post("/assignments/:assignmentId/review", reviewAssignment);

export default router;
