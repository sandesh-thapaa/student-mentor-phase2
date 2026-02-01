import { Request, Response, NextFunction } from "express";
import * as studentService from "../service/student.service";
import { AppError } from "../utils/apperror";

interface AuthRequest extends Request {
  user?: any;
}

export const getStudentDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "STUDENT") {
      throw new AppError("Access denied. Students only.", 403);
    }

    const dashboard = await studentService.getStudentDashboardService(userId);
    res.status(200).json(dashboard);
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to fetch student dashboard",
        error.statusCode || 500
      )
    );
  }
};

export const getStudentTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "STUDENT") {
      throw new AppError("Access denied. Students only.", 403);
    }

    const tasks = await studentService.getStudentTasksService(userId);

    res.status(200).json(tasks);
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to fetch student tasks",
        error.statusCode || 500
      )
    );
  }
};

export const submitStudentTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "STUDENT") {
      throw new AppError("Access denied. Students only.", 403);
    }

    const { taskId } = req.params;

    if (!taskId) {
      throw new AppError("Task ID is required in params", 400);
    }

    const assignment = await studentService.submitStudentTaskService(
      userId,
      taskId,
      req.body
    );

    res.status(200).json({
      message: "Task submitted successfully",
      assignment,
    });
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to submit task",
        error.statusCode || 500
      )
    );
  }
};

export const getStudentProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "STUDENT") {
      throw new AppError("Access denied. Students only.", 403);
    }

    const progress = await studentService.getStudentProgressService(userId);

    res.status(200).json(progress);
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to fetch student progress",
        error.statusCode || 500
      )
    );
  }
};



export const resolveWarning = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;
    const { warningId } = req.params;
    const { comment } = req.body;

    if (!warningId) {
       throw new AppError("Warning ID is required", 400);
    }

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (req.user.role !== "STUDENT") {
      throw new AppError("Access denied. Students only.", 403);
    }

    const updatedWarning = await studentService.resolveWarningService(
      userId,
      warningId,
      comment
    );

    res.status(200).json({
      message: "Warning resolved successfully",
      warning: updatedWarning,
    });
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to resolve warning",
        error.statusCode || 500
      )
    );
  }
};
