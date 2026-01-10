import prisma from "../connect/index";
import { AppError } from "../utils/apperror";
import { TaskStatus } from "@prisma/client";

export const createTaskService = async (mentorId: string, data: any) => {
  const course = await prisma.course.findUnique({
    where: { course_id: data.course_id },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.mentor_id !== mentorId) {
    throw new AppError("You can only create tasks for your own courses", 403);
  }

  const newTask = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      doc_link: data.doc_link || null,
      course_id: data.course_id,
    },
  });

  return newTask;
};

export const getTaskService = async (taskId: string, userId: string, role: string) => {
  const task = await prisma.task.findUnique({
    where: { task_id: taskId },
    include: {
      course: {
        select: {
          title: true,
          mentor_id: true,
        },
      },
    }
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }


  return task;
};

export const reviewTaskService = async (mentorId: string, taskId: string, data: any) => {
  const { studentId, status, remark } = data;

  if (!studentId || !status) {
    throw new AppError("Student ID and Status are required", 400);
  }

  // Verify that the task belongs to a course owned by the mentor
  const task = await prisma.task.findUnique({
    where: { task_id: taskId },
    include: { course: true }
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.course.mentor_id !== mentorId) {
    throw new AppError("You are not authorized to review this task", 403);
  }


  const assignment = await prisma.taskAssignment.findUnique({
    where: {
      task_id_student_id: {
        task_id: taskId,
        student_id: studentId,
      }
    }
  });

  if (!assignment) {
      throw new AppError("Assignment not found for this student", 404);
  }

  const updatedAssignment = await prisma.taskAssignment.update({
    where: {
      task_id_student_id: {
        task_id: taskId,
        student_id: studentId,
      }
    },
    data: {
      status: status as TaskStatus,
      mentor_remark: remark,
      reviewedAt: new Date(),
    }
  });

  return updatedAssignment;
};

export const getAllTasksForMentorService = async (mentorId: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      course: {
        mentor_id: mentorId,
      },
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return tasks;
};
