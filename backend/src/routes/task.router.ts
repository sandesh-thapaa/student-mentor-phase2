import { Router } from "express";
import { createTask, getTask, reviewTask } from "../controller/task.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post('/', createTask);
router.get('/:taskId', getTask);
router.put('/:taskId/review', reviewTask);

export default router;
