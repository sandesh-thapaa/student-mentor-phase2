import api from "./axios";
import { type Warning, WarningLevel } from "../features/mentor/types/warning";

export const issueWarning = async (
  studentId: string,
  remark: string,
  title: string,
  level: WarningLevel
): Promise<Warning> => {
  const res = await api.post("/warnings", {
    student_id: studentId,
    remark,
    title,
    level,
  });
  return res.data;
};

export const getStudentWarnings = async (studentId: string): Promise<Warning[]> => {
    const res = await api.get(`/warnings?student_id=${studentId}`);
    return res.data;
}
