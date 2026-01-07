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
    where: { mentor_id: mentorId, isActive: true }
  });

  return { mentor, stats: { totalStudents } };
};

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
        }
      }
    }
  });

  return students.map(ms => ms.student);
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
