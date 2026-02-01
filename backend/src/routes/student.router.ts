import { Router } from "express";
import { getStudentDashboard, getStudentTasks, submitStudentTask, getStudentProgress, resolveWarning } from "../controller/student.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/dashboard", getStudentDashboard); // fetch student dashboard
router.get("/tasks", getStudentTasks); //fetch assigned tasks
router.get("/progress", getStudentProgress); //fetch student progress
router.post("/tasks/:taskId/submit", submitStudentTask); //submit task
router.patch("/warnings/:warningId/resolve", resolveWarning); //resolve warning

export default router;


