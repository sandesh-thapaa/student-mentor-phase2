import jwt from "jsonwebtoken";
import prisma from "../connect/index"; // Corrected import
import { AppError } from "../utils/apperror";

const getRoleFromId = (userId: string): 'STUDENT' | 'MENTOR' | null => {
  if (userId.startsWith('26STD')) return 'STUDENT';
  if (userId.startsWith('26MEN')) return 'MENTOR';
  return null;
};

export const loginUserService = async ({ userId, password, user_id }: any) => {
  const loginId = userId || user_id;

  if (!loginId || !password) {
    throw new AppError("User ID and password are required", 400);
  }

  const role = getRoleFromId(loginId);
  if (!role) {
     throw new AppError("Invalid User ID format", 400);
  }

  const user = await prisma.user.findUnique({
    where: { user_id: loginId },
  });
  // console.log(user);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== role) {
      throw new AppError("User role mismatch with ID", 403);
  }


  // Plain text comparison with trimming to handle accidental whitespace
  const isPasswordValid = password.trim() === user.password.trim();
  
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const {password : userpass, ...rest} = user
  const tokenPayload = JSON.parse(JSON.stringify({...rest}))

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "fallback_secret_key", { expiresIn: "1d" });

  return {
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      role: user.role,
      name: (user as any).name 
    },
  };
};

export const logoutUserService = () => {
  return { message: "Logout successful" };
};
