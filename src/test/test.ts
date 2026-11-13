import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: { fullName: "Samuel", email: "samuel@example.com" },
  });
  console.log(user);
}
main().finally(() => prisma.$disconnect());