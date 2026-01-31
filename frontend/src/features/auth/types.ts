export type UserRole = "student" | "mentor";

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  role: UserRole;
  token: string;
  name?: string; // Add this, making it optional just in case
}

export type AuthUser = {
  id: string;
  role: "STUDENT" | "MENTOR";
  token: string;
  name: string;
};