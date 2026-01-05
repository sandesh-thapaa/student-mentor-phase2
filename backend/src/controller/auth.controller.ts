
import { Request, Response, NextFunction } from 'express';
import * as authService from '../service/auth.service';
import { AppError } from '../utils/apperror';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.loginUserService(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Login failed', 500));
    }
};
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = authService.logoutUserService();
        res.status(200).json(result); 
    } catch (error: any) {
        next(new AppError(error.message || 'Logout failed', 500));
    }
};

