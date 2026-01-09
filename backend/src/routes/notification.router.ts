import { Router } from "express";
import { getNotifications, sendNotification } from "../controller/notification.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getNotifications);
router.post("/", restrictTo('MENTOR'), sendNotification); 

export default router;
