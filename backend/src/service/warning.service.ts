import prisma from "../connect/index";
import { AppError } from "../utils/apperror";
import { WarningLevel, WarningStatus } from "@prisma/client";

interface IssueWarningPayload {
  student_id: string;
  title: string;
  remark: string;
  title: string;
  level: WarningLevel;
  status: WarningStatus
}

export const issueWarningService = async (
  mentorId: string,
  payload: IssueWarningPayload
) => {
  const { student_id, title, remark, level, status } = payload;

  if (!student_id || !title || !remark || !level || !status) {
    throw new AppError("student_id, title, remark, level and status are required", 400);
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

  const warning = await prisma.warning.create({
    data: {
      student_id,
      mentor_id: mentorId,
      title,
      remark,
      level,
      status
    }
  });

  const student = await prisma.student.update({
    where: { student_id },
    data: {
      warning_count: {
        increment: 1,
      }
    },
  });

  return { warning, student };
};

export const getStudentWarningsService = async (
  userId: string
) => {
  // Check if the student exists by the given id (userId)
  const student = await prisma.student.findUnique({
    where: { student_id: userId },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  // Fetch all warnings only for this particular student
  const warnings = await prisma.warning.findMany({
    where: { student_id: userId },
    include: {
      mentor: {
        select: {
          mentor_id: true,
          name: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  // Count warnings by status
  const activeCount = await prisma.warning.count({
    where: { student_id: userId, status: "ACTIVE" },
  });

  const resolvedCount = await prisma.warning.count({
    where: { student_id: userId, status: "RESOLVED" }, // or RESOLVED if you use that
  });

  return {
    warnings,
    counts: {
      active: activeCount,
      resolved: resolvedCount,
    },
  }

};


