import prisma from "../connect/index";
import { AppError } from "../utils/apperror";
import { TaskStatus, WarningLevel } from "@prisma/client";

export const getStudentDashboardService = async (studentId: string) => {
  
  const student = await prisma.student.findUnique({
    where: { student_id: studentId },
    select: {
      student_id: true,
      name: true,
      photo: true,
      social_links: true,
      progress: true,
      warning_count: true,
      warning_status: true,
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const assignments = await prisma.taskAssignment.findMany({
    where: { student_id: studentId },
  });

  const stats = {
    totalTasks: assignments.length,
    pending: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
  };

  assignments.forEach((assignment) => {
    switch (assignment.status) {
      case TaskStatus.PENDING:
        stats.pending += 1;
        break;
      case TaskStatus.SUBMITTED:
        stats.submitted += 1;
        break;
      case TaskStatus.APPROVED:
        stats.approved += 1;
        break;
      case TaskStatus.REJECTED:
        stats.rejected += 1;
        break;
      default:
        break;
    }
  });

  const activeMentors = await prisma.mentorStudent.count({
    where: { student_id: studentId, isActive: true },
  });

  // Gather warning stats
  const warningStats = await prisma.warning.groupBy({
    by: ["level"],
    where: { student_id: studentId },
    _count: { level: true },
  });
  console.log(warningStats)

  const warningStatsByLevel: Record<WarningLevel, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };
  warningStats.forEach((w) => {
    warningStatsByLevel[w.level as WarningLevel] = w._count.level;
  });

  return {
    student,
    stats,
    warningStats: {
      totalWarnings: student.warning_count,
      warningStatus: student.warning_status,
      Level: warningStatsByLevel,
    },
  };
};

export const getStudentTasksService = async (studentId: string) => {
  if (!studentId) {
    throw new AppError("Student ID is required", 400);
  }

  const student = await prisma.student.findUnique({
    where: { student_id: studentId },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const assignments = await prisma.taskAssignment.findMany({
    where: { student_id: studentId },
    include: {
      task: {
        select: {
          task_id: true,
          title: true,
          description: true,
          doc_link: true,
          course: {
            select: {
              course_id: true,
              title: true,
              url: true,
              mentor_id: true,
              mentor: {
                select: {
                  name: true
                }
              }
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return assignments;
};


interface SubmitTaskPayload {
  github_link?: string;
  hosted_link?: string;
}

export const submitStudentTaskService = async (
  studentId: string,
  taskId: string,
  payload: SubmitTaskPayload
) => {
  if (!studentId) {
    throw new AppError("Student ID is required", 400);
  }

  if (!taskId) {
    throw new AppError("Task ID is required", 400);
  }

  const { github_link, hosted_link } = payload;

  if (!github_link && !hosted_link) {
    throw new AppError(
      "At least one of github_link or hosted_link is required",
      400
    );
  }

  const assignment = await prisma.taskAssignment.findUnique({
    where: {
      task_id_student_id: {
        task_id: taskId,
        student_id: studentId
      }
    }
  });

  if (!assignment) {
    throw new AppError("Task assignment not found for this student", 404);
  }

  // Check if the task is already submitted and a github_link is already present in DB
  if (
    assignment.status === TaskStatus.SUBMITTED &&
    assignment.github_link // optionally && assignment.github_link !== ""
  ) {
    throw new AppError("Task already submitted", 400);
  }

  const updatedAssignment = await prisma.taskAssignment.update({
    where: {
      task_id_student_id: {
        task_id: taskId,
        student_id: studentId,
      },
    },
    data: {
      github_link: github_link as string,
      hosted_link: hosted_link as string,
      status: TaskStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });

  return updatedAssignment;
};

export const getStudentProgressService = async (studentId: string) => {
  if (!studentId) {
    throw new AppError("Student ID is required", 400);
  }

  const student = await prisma.student.findUnique({
    where: { student_id: studentId },
    select: {
      student_id: true,
      name: true,
      progress: true,
      warning_count: true,
      warning_status: true,
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  // Get task statistics
  const assignments = await prisma.taskAssignment.findMany({
    where: { student_id: studentId },
    select: {
      status: true,
      task: {
        select: {
          course: {
            select: {
              course_id: true,
              title: true,
            }
          }
        }
      }
    },
  });

  const taskStats = {
    totalTasks: assignments.length,
    pending: 0,
    submitted: 0,
    approved: 0,
  };

  assignments.forEach((assignment) => {
    switch (assignment.status) {
      case TaskStatus.PENDING:
        taskStats.pending += 1;
        break;
      case TaskStatus.SUBMITTED:
        taskStats.submitted += 1;
        break;
      case TaskStatus.APPROVED:
        taskStats.approved += 1;
        break;
      default:
        break;
    }
  });

  // Get unique courses where the student has assignments, including the title only
  // Flatten all course objects from assignments, filter out null (if any assignment has no task/course)
  const courseMap: Map<string, { course_id: string, title: string }> = new Map();
  assignments.forEach((assignment) => {
    if (assignment.task && assignment.task.course) {
      const { course_id, title } = assignment.task.course;
      courseMap.set(course_id, { course_id, title });
    }
  });
  const courses = Array.from(courseMap.values());

  // Calculate completion percentage
  const completionPercentage =
    taskStats.totalTasks > 0
      ? (taskStats.submitted / taskStats.totalTasks) * 100
      : 0;

  return {
    courses, // List of courses with only course_id and title
    taskStats,
    completionPercentage: Math.round(completionPercentage * 100) / 100, // Round to 2 decimal places
  };
};

