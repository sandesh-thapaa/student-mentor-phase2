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
