// import prisma from config
import { prisma } from "../config/prisma.js";
// user repo
export class UserRepository {
  constructor() {}
  // find by userId if exists
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    return user;
  }
  // find user by email if exists
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    return user;
  }
  // create user
  async createUser(data: UserInfo) {
    return prisma.user.create({
      data
    });
  }
  // update user
  async updateUser(data: UserInfo) {
    const { email, password } = data;
    return prisma.user.update({
      where: {
        email
      },
      data: {
        email,
        password
      }
    });
  }
}
