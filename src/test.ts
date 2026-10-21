// import prisma from "./config/prisma";

// async function test() {
//     const users = await prisma.user.findMany();

//     console.log(users);
// }

// test();


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });