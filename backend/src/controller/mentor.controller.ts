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

export const createStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; // Mentor ID
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const { name, password, photo, social_links } = req.body;
        if (!name || !password) {
            throw new AppError("Name and password are required", 400);
        }

        const newStudent = await mentorService.createStudentService(userId, {
            name,
            password,
            photo,
            social_links
        });

        res.status(201).json(newStudent);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to create student', error.statusCode || 500));
    }
};

export const updateStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; // Mentor ID
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const { studentId } = req.params;
        if (!studentId) {
             throw new AppError("Student ID is required", 400);
        }
        const updates = req.body;

        const updatedStudent = await mentorService.updateStudentService(userId!, studentId, updates);

        res.status(200).json(updatedStudent);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to update student', error.statusCode || 500));
    }
};
