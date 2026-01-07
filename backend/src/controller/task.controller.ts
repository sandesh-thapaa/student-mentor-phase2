import { Request, Response, NextFunction } from "express";
import * as taskService from "../service/task.service";
import { AppError } from "../utils/apperror";

interface AuthRequest extends Request {
    user?: any;
}

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const { title, description, course_id, doc_link } = req.body;
        if (!title || !description || !course_id) {
            throw new AppError("Title, description, and course_id are required", 400);
        }

        const result = await taskService.createTaskService(userId, {
            title, description, course_id, doc_link
        });

        res.status(201).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to create task', error.statusCode || 500));
    }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; // Any authenticated user
        if (!userId) {
             throw new AppError("User not authenticated", 401);
        }

        const { taskId } = req.params;
        if (!taskId) {
            throw new AppError("Task ID is required", 400);
        }

        const result = await taskService.getTaskService(taskId, userId, req.user.role);
        res.status(200).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to get task', error.statusCode || 500));
    }
};

export const reviewTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const { taskId } = req.params;
        const { studentId, status, remark } = req.body;

        if (!taskId) {
             throw new AppError("Task ID is required", 400);
        }

        const result = await taskService.reviewTaskService(userId, taskId, {
            studentId, status, remark
        });

        res.status(200).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to review task', error.statusCode || 500));
    }
};
