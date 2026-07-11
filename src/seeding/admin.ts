import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { Role } from "../generated/prisma/client.js";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@raco.ai",
    },
    update: {},
    create: {
      email: "admin@raco.ai",
      username: "admin",
      firstName: "System",
      lastName: "Administrator",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(admin);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });