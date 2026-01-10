import { Router } from "express";
import { createTask, getTask, reviewTask, getAllTasks } from "../controller/task.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:taskId', getTask);
router.put('/:taskId/review', reviewTask);

export default router;
