// 1. Task Interface for the history table
export interface StudentTask {
  task_id: string;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  mentor_remark?: string;
  submission_link?: string;
  submitted_at?: string;
}

// 2. The Summary (What you get in the list of 8 students)
export interface AssignedStudent {
  student_id: string;
  name: string;
  photo: string | null;
  progress: number;
  warning_status: "ACTIVE" | null; 
}

// 3. The Whole Detail (What you get from /mentors/students/{id})
export interface StudentFullProfile extends AssignedStudent {
  contact: string;
  bio: string | null;
  warning_count: number;
  social_links: {
    github?: string;
    linkedin?: string;
  };
  tasks: StudentTask[];
}

// 4. Mentor Dashboard Stats
export interface MentorDashboard {
  mentor: {
    name: string;
    photo: string | null;
    contact: string;
    bio: string | null;
  };
  stats: {
    totalStudents: number;
  };
}