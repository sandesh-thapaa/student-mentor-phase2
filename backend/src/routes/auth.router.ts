import { Router } from 'express';
import {validate} from '../middleware/validate.middleware'
import {
  loginUser,
  logoutUser,

} from '../controller/auth.controller';
import { loginSchema } from '../validators/auth.validators';


const router = Router();


router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);

export default router;
