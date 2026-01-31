
import { type Mentor,type Task } from "./index";

export interface Course {
  course_id: string;
  title: string;
  url?: string;
  description?: string;
  mentor_id: string;
  mentor: Mentor;
  tasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}
