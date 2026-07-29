// import prisma from config
import { prisma } from "../config/prisma.js";
import { UserInfo } from "../types/user.js";
import { Role } from "../generated/prisma/enums.js";
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

  // find by username if exists
  async findByUserName(username: string) {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    return user;
  }

  // find existing user
  async findExistingUser(email: string, username: string){
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {email},
          {username}
        ]
      }
    });
    return user;
  }

  async findAdmins() {
    return prisma.user.findMany({
      where: { role: Role.ADMIN },
      orderBy: { email: "asc" }
    });
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

  // update profile fields by user id
  async updateProfile(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email
      }
    });
  }
}
