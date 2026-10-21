import prisma from "../config/prisma";

export const findUserByEmail = (
  email: string
) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};