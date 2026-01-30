import prisma from "../connect/index";
import { AppError } from "../utils/apperror";

export const getMentorDashboardService = async (mentorId: string) => {
  const mentor = await prisma.mentor.findUnique({
    where: { mentor_id: mentorId },
    select: {
      name: true,
      photo: true,
      contact: true,
      bio: true,
    },
  });

  if (!mentor) {
    throw new AppError("Mentor not found", 404);
  }

  const totalStudents = await prisma.mentorStudent.count({
    where: { mentor_id: mentorId, isActive: true },
  });

  return { mentor, stats: { totalStudents } };
};


interface MentorStudentWithStudent {
  student: {
    student_id: string;
    name: string;
    photo: string | null;
    progress: number;
    warning_status: string | null;
  };
}

export const getMentorStudentsService = async (mentorId: string) => {
  const students = await prisma.mentorStudent.findMany({
    where: { mentor_id: mentorId, isActive: true },
    include: {
      student: {
        select: {
          student_id: true,
          name: true,
          photo: true,
          progress: true,
          warning_status: true,
        },
      },
    },
  });

  return students.map((ms: MentorStudentWithStudent) => ms.student);
};


interface AssignTaskPayload {
  task_id: string;
  student_id: string;
}

export const assignTaskToStudentService = async (
  mentorId: string,
  payload: AssignTaskPayload
) => {
  const { task_id, student_id } = payload;

  if (!task_id || !student_id) {
    throw new AppError("task_id and student_id are required", 400);
  }

  const task = await prisma.task.findUnique({
    where: { task_id },
    include: {
      course: {
        select: {
          mentor_id: true,
        },
      },
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.course.mentor_id !== mentorId) {
    throw new AppError("You can only assign tasks from your own courses", 403);
  }

  const isStudentAssignedToMentor = await prisma.mentorStudent.findFirst({
    where: {
      mentor_id: mentorId,
      student_id,
      isActive: true,
    },
  });

  if (!isStudentAssignedToMentor) {
    throw new AppError(
      "This student is not currently assigned to you as a mentor",
      403
    );
  }

  try {
    const assignment = await prisma.taskAssignment.create({
      data: {
        task_id,
        student_id,
      },
      include: {
        task: true,
      },
    });

    return assignment;
  } catch (error: any) {
    // Handle unique constraint: a student can only have one assignment per task
    if (
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta?.target.includes("task_id") &&
      error.meta?.target.includes("student_id")
    ) {
      throw new AppError(
        "This task is already assigned to this student",
        400
      );
    }

    throw error;
  }
};

export const createStudentService = async (mentorId: string, data: any) => {
  const lastStudent = await prisma.user.findFirst({
    where: { role: 'STUDENT', user_id: { startsWith: '26STD' } },
    orderBy: { user_id: 'desc' },
  });

  let newId = '26STD0001';
  if (lastStudent) {
    const lastNum = parseInt(lastStudent.user_id.replace('26STD', ''));
    newId = `26STD${String(lastNum + 1).padStart(4, '0')}`;
  }

  // 2. Create User, Student, and Assign to Mentor in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create User
    await tx.user.create({
      data: {
        user_id: newId,
        password: data.password, // In a real app, hash this! Validating "plain text" as per previous context? Previous convo said "Modify authentication service to compare passwords in plain text". So storing plain text here.
        role: 'STUDENT',
      },
    });

    const newStudent = await tx.student.create({
      data: {
        student_id: newId,
        name: data.name,
        photo: data.photo || null,
        social_links: data.social_links || {},
      },
    });

    await tx.mentorStudent.create({
      data: {
        id: `${mentorId}-${newId}`, 
        mentor_id: mentorId,
        student_id: newId,
      }
    });

    return newStudent;
  });

  return result;
};

export const updateStudentService = async (mentorId: string, studentId: string, data: any) => {
  // 1. Verify student exists and is assigned to this mentor
  // Strictly speaking, we might just check if the student exists, but for security, checking the relation is better.
  const relation = await prisma.mentorStudent.findUnique({
    where: {
      mentor_id_student_id: {
        mentor_id: mentorId,
        student_id: studentId
      }
    }
  });

  if (!relation) {
    throw new AppError("Student is not assigned to you or does not exist", 403);
  }

  const updatedStudent = await prisma.student.update({
    where: { student_id: studentId },
    data: {
      name: data.name,
      photo: data.photo,
      social_links: data.social_links,
    }
  });

  return updatedStudent;
};

export const deleteStudentService = async (mentorId: string, studentId: string) => {
  // Verify student is assigned to mentor
  const relation = await prisma.mentorStudent.findUnique({
    where: {
      mentor_id_student_id: {
        mentor_id: mentorId,
        student_id: studentId
      }
    }
  });

  if (!relation) {
    throw new AppError("Student is not assigned to you or does not exist", 403);
  }

  // Delete the User record (cascades to Student and MentorStudent)
  await prisma.user.delete({
    where: { user_id: studentId }
  });

  return { message: "Student deleted successfully" };
};

export const getMentorAssignmentsService = async (mentorId: string) => {
  // Fetch assignments for tasks that belong to courses created by this mentor
  const assignments = await prisma.taskAssignment.findMany({
    where: {
      task: {
        course: {
          mentor_id: mentorId
        }
      }
    },
    include: {
      student: {
        select: {
          student_id: true,
          name: true,
          photo: true
        }
      },
      task: {
        select: {
          task_id: true,
          title: true,
          course: {
            select: {
              title: true
            }
          }
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  return assignments;
};

export const reviewAssignmentService = async (mentorId: string, assignmentId: string, data: { status: string, remark: string }) => {
  const { status, remark } = data;

  // Validate status enum
  const validStatuses = ["APPROVED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status. Allowed: APPROVED, REJECTED", 400);
  }

  // Verify assignment exists and belongs to a task created by this mentor
  const assignment = await prisma.taskAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      task: {
        include: {
          course: true
        }
      }
    }
  });

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  if (assignment.task.course.mentor_id !== mentorId) {
    throw new AppError("You can only review assignments for your own courses", 403);
  }

  const updatedAssignment = await prisma.taskAssignment.update({
    where: { id: assignmentId },
    data: {
      status: status as any, // Cast to any or TaskStatus enum if imported
      mentor_remark: remark,
      reviewedAt: new Date()
    }
  });

  return updatedAssignment;
};
