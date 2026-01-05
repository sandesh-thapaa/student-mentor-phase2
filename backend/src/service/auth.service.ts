import jwt from "jsonwebtoken";
import prisma from "../connect/index"; // Corrected import
import { AppError } from "../utils/apperror";

// Helper to determine role from ID
const getRoleFromId = (userId: string): 'STUDENT' | 'MENTOR' | null => {
  if (userId.startsWith('26STD')) return 'STUDENT';
  if (userId.startsWith('26MEN')) return 'MENTOR';
  return null;
};

export const loginUserService = async ({ userId, password }: any) => {
  if (!userId || !password) {
    throw new AppError("User ID and password are required", 400);
  }

  // Validate ID format and infer role
  const role = getRoleFromId(userId);
  if (!role) {
     throw new AppError("Invalid User ID format", 400);
  }

  // 1️⃣ Find user from users table
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });
  console.log(user);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify Role matches (optional, but good for consistency)
  if (user.role !== role) {
      throw new AppError("User role mismatch with ID", 403);
  }


  const isPasswordValid = password === user.password;
  
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const {password : userpass, ...rest} = user
  const tokenPayload = JSON.parse(JSON.stringify({...rest}))

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "fallback_secret_key", { expiresIn: "1h" });

  // 3️⃣ Return response (Token Generated)
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
