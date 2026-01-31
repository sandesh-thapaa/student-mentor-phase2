
import { type Course,type Student } from "./index";

export enum TaskStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Task {
  task_id: string;
  title: string;
  description: string;
  doc_link?: string;
  course_id: string;
  course: Course;
  assignments?: TaskAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  student_id: string;
  task: Task;
  student: Student;
  github_link?: string;
  hosted_link?: string;
  status: TaskStatus;
  mentor_remark?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
