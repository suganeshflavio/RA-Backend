
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: {
      email: "admin@ramarsacademy.com",
    },
  });

  if (admin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("RaMaRsAdMiN@12345", 10);

  await prisma.user.create({
    data: {
      name: "RA Admin",
      email: "admin@ramarsacademy.com",
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