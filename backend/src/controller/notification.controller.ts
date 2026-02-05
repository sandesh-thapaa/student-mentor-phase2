import { Request, Response, NextFunction } from "express";
import * as notificationService from "../service/notification.service";
import { NotificationType } from "@prisma/client";
import { AppError } from "../utils/apperror";

interface AuthRequest extends Request {
  user?: any;
}

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("Decoded User:", req.user); 
    const userId = req.user?.user_id; 
    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
         return 
    }

    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, message, type, relatedId } = req.body;

    if (!userId || !message) {
       res.status(400).json({ message: "userId and message are required" });
       return
    }

    // Default to MENTOR_MESSAGE if type is invalid or missing, since only mentors can send notifications
    const notificationType = (type as NotificationType) || NotificationType.MENTOR_MESSAGE;

    const notification = await notificationService.createNotification(
      userId,
      message,
      notificationType,
      relatedId
    );

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    // Check if user's role is STUDENT, else deny access
    if (req.user.role !== 'STUDENT') {
      throw new AppError("Only students can mark notifications as read.", 403);
    }

    const { notificationId } = req.params;

    if (!notificationId) {
      throw new AppError("Notification ID is required", 400);
    }

    const notification = await notificationService.markNotificationAsReadService(notificationId, userId);

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to mark notification as read",
        error.statusCode || 500
      )
    );
  }
};

// Mark all notifications as read for the current user
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    // Check if user's role is STUDENT, else deny access
    if (req.user.role !== 'STUDENT') {
        throw new AppError("Only students can mark notifications as read.", 403);
    }

    await notificationService.markAllNotificationsAsReadService(userId);
    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    next(
      new AppError(
        error.message || "Failed to mark all notifications as read",
        error.statusCode || 500
      )
    );
  }
};
