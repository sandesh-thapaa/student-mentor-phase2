import { Request, Response, NextFunction } from "express";
import * as mentorService from "../service/mentor.service";
import { AppError } from "../utils/apperror";

interface AuthRequest extends Request {
    user?: any;
}

export const getMentorDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; 
        if (!userId) {
             throw new AppError("User not authenticated", 401);
        } 
        if (req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const result = await mentorService.getMentorDashboardService(userId);
        res.status(200).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to fetch dashboard', error.statusCode || 500));
    }
};

export const getMentorStudents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
             throw new AppError("User not authenticated", 401);
        }
  
        if (req.user.role !== 'MENTOR') {
             throw new AppError("Access denied. Mentors only.", 403);
        }
        const result = await mentorService.getMentorStudentsService(userId);
        res.status(200).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to fetch students', 500));
    }
};
