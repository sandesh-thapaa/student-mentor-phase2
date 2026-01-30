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

export const getMentorStudents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "MENTOR") {
      throw new AppError("Access denied. Mentors only.", 403);
    }
    const result = await mentorService.getMentorStudentsService(userId);
    res.status(200).json(result);
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to fetch students",
        error.statusCode || 500
      )
    );
  }
};

export const assignTaskToStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "MENTOR") {
      throw new AppError("Access denied. Mentors only.", 403);
    }

    const assignment = await mentorService.assignTaskToStudentService(
      userId,
      req.body
    );

    res.status(201).json({
      message: "Task assigned to student successfully",
      assignment,
    });
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to assign task to student",
        error.statusCode || 500
      )
    );
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

export const deleteStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; // Mentor ID
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const { studentId } = req.params;
        if (!studentId) {
             throw new AppError("Student ID is required", 400);
        }

        const result = await mentorService.deleteStudentService(userId, studentId);

        res.status(200).json(result);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to delete student', error.statusCode || 500));
    }
};

export const getMentorAssignments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; // Mentor ID
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const assignments = await mentorService.getMentorAssignmentsService(userId);
        res.status(200).json(assignments);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to fetch assignments', error.statusCode || 500));
    }
};

export const reviewAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id; // Mentor ID
        if (!userId || req.user.role !== 'MENTOR') {
            throw new AppError("Access denied. Mentors only.", 403);
        }

        const { assignmentId } = req.params;
        const { status, remark } = req.body;

         if (!assignmentId) {
             throw new AppError("Assignment ID is required", 400);
        }
        if (!status) {
            throw new AppError("Status is required", 400);
        }

        const updatedAssignment = await mentorService.reviewAssignmentService(userId!, assignmentId, { status, remark });

        res.status(200).json(updatedAssignment);
    } catch (error: any) {
        next(new AppError(error.message || 'Failed to review assignment', error.statusCode || 500));
    }
};
