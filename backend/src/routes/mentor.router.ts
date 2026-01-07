import { Router } from "express";
import { getMentorDashboard, getMentorStudents, createStudent, updateStudent } from "../controller/mentor.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect); 

router.get('/dashboard', getMentorDashboard);
router.get('/students', getMentorStudents);
router.post('/students', createStudent);
router.put('/students/:studentId', updateStudent);

export default router;
