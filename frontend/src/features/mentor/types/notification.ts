
export enum NotificationType {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_REVIEWED = "TASK_REVIEWED",
  WARNING_ISSUED = "WARNING_ISSUED",
  COURSE_CREATED = "COURSE_CREATED",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: string;
  createdAt: Date;
  readAt?: Date;
}
