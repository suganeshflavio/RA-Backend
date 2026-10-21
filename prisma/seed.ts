// Email:
//TKS@gmail.com

// Password:
// TkS@12345

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: {
      email: "admin@tksacademy.com",
    },
  });

  if (admin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("TkSaDmIn@12345", 10);

  await prisma.user.create({
    data: {
      name: "TKS Admin",
      email: "admin@tksacademy.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin Created Successfully");
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });