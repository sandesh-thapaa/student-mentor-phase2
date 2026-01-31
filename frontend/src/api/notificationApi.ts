import api from "./axios";
import {type Notification } from "../features/mentor/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
    const res = await api.get("/notifications");
    return res.data;
}

export const sendNotification = async (notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'readAt'>): Promise<Notification> => {
    const res = await api.post("/notifications", notificationData);
    return res.data;
}

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    const res = await api.put(`/notifications/${notificationId}/read`);
    return res.data;
}

export const markAllAsRead = async (): Promise<{ message: string }> => {
    const res = await api.put("/notifications/read/all");
    return res.data;
}
