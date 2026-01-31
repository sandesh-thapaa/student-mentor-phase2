export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Student {
  student_id: string;
  name: string;
  photo: string | null;
  social_links: SocialLinks | null;
  progress: number;
  warning_count: number;
  warning_status: string | null;
  enrolled_course?: string; 
  meeting_link?: string;  
}
  
  export interface Stats {
    totalTasks: number;
    pending: number;
    submitted: number;
    approved: number;
    rejected: number;
  }
  
  export interface WarningLevel {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  }
  
  export interface WarningStats {
    totalWarnings: number;
    warningStatus: "ACTIVE" | "INACTIVE";
    Level: WarningLevel;
  }
  
  export interface StudentDashboard {
    student: Student;
    stats: Stats;
    warningStats: WarningStats;
  }


  // Course Type
export interface Course {
  course_id: string;
  title: string;
  url?: string;
}

// Task Type
export interface Task {
  task_id: string;
  title: string;
  description: string;
  doc_link: string | null;
  course: Course;
}

export type AssignmentStatus =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PENDING";

// Student Assignment Type

export interface StudentAssignment {
  id: string;
  task_id: string;
  student_id: string;
  github_link: string | null;
  hosted_link: string | null;
  status: AssignmentStatus;
  mentor_remark: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  task: Task;
}

// Example: Array of assignments
export type StudentAssignmentsResponse = StudentAssignment[];

