import { CustomError } from "@/lib/Error";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { nextOptions } from "./api/auth/[...nextauth]/options";

export const getUser = async () => {
  const session = await getServerSession(nextOptions);

  if (!session?.user) return null;

  const { id, role } = session?.user;

  try {
    const user =
      role === "Student"
        ? (await prisma.user.findUnique({
            where: { id },
          }))
        : (await prisma.admin.findUnique({
            where: { id },
          }));

          
    if (!user)
      throw new CustomError("User not found", false, 404);
    
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;

  } catch (error) {
    if (error instanceof CustomError) {
      return { error : error.error };
    } else {
      return { error:  (error as Error).message };
    }
  }
};
