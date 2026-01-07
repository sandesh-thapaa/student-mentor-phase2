import { Router } from "express";
import { getMentorDashboard, getMentorStudents } from "../controller/mentor.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect); 

router.get('/dashboard', getMentorDashboard);
router.get('/students', getMentorStudents);

export default router;
