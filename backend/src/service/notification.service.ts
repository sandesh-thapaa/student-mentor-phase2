import prisma from "../connect";
import { NotificationType } from "@prisma/client";

export const getNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createNotification = async (
  userId: string,
  message: string,
  type: NotificationType,
  relatedId?: string
) => {
  return await prisma.notification.create({
    data: {
      user_id: userId,
      message,
      type,
      relatedId: relatedId || null,
    },
  });
};

export const markAsRead = async (notificationId: string) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

export const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { 
      user_id: userId,
      isRead: false 
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};
