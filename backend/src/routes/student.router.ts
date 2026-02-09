import { Router } from "express";
import { getStudentDashboard, getStudentTasks, submitStudentTask, getStudentProgress, resolveWarning } from "../controller/student.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/dashboard", getStudentDashboard);
router.get("/tasks", getStudentTasks);
router.get("/progress", getStudentProgress);
router.post("/tasks/:taskId/submit", submitStudentTask);
router.patch("/warnings/:warningId/resolve", resolveWarning);

export default router;


