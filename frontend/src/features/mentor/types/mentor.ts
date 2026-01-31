
import { type MentorStudent, type Course,type Warning } from "./index";

export interface Mentor {
  mentor_id: string;
  name: string;
  photo?: string;
  contact?: string;
  bio?: string;
  studentAssignments?: MentorStudent[];
  courses?: Course[];
  warningsSent?: Warning[];
  createdAt: Date;
  updatedAt: Date;
}
