import api from "./axios";
import { type Warning } from "../features/mentor/types/warning";

export const issueWarning = async (warningData: Omit<Warning, 'id' | 'student' | 'mentor' | 'createdAt'>): Promise<Warning> => {
    const res = await api.post("/warnings", warningData);
    return res.data;
}

export const getStudentWarnings = async (studentId: string): Promise<Warning[]> => {
    const res = await api.get(`/warnings?student_id=${studentId}`);
    return res.data;
}
