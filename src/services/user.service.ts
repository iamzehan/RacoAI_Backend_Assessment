import { User } from "../generated/prisma/client.js";
import { UserRepository } from "../repositories/user.repository.js";
import { Profile } from "../types/user.js";
import { Role } from "../generated/prisma/enums.js";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  private filterResponse =(user: User): Profile => {
    return {
      id: user?.id,
      email: user?.email,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role
    };
  }
  // Profile
  profile = async (userId: string): Promise<Profile> => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found!");
    return this.filterResponse(user);
  };

  // find user by email 
  findByEmail = async (email: string): Promise<Profile> => {
    const user = await this.userRepository.findByEmail(email);
    if(!user) throw new Error("User not found!");
    return this.filterResponse(user);
  }

  // find user by username 
  findByUserName = async (username: string) : Promise<Profile> => {
    const user = await this.userRepository.findByUserName(username);
    if(!user) throw new Error("User not found!");
    return this.filterResponse(user);
  }

  // find existing user
  findExistingUser = async (email: string, username: string)=> {
    const user = await this.userRepository.findExistingUser(email, username);
    if(!user) throw new Error("User not found!");
    return this.filterResponse(user);
  }

  // update profile
  updateProfile = async (
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
    }
  ): Promise<Profile> => {
    const existing = await this.userRepository.findById(userId);
    if (!existing) throw new Error("User not found!");

    const conflict = await this.userRepository.findExistingUser(
      data.email,
      data.username
    );

    if (conflict && conflict.id !== userId) {
      if (conflict.email === data.email) {
        throw new Error("Email already exists");
      }
      if (conflict.username === data.username) {
        throw new Error("Username already exists");
      }
    }

    const updated = await this.userRepository.updateProfile(userId, data);
    return this.filterResponse(updated);
  };

  listAdmins = async (): Promise<Profile[]> => {
    const admins = await this.userRepository.findAdmins();
    return admins.map((admin) => this.filterResponse(admin));
  };

  updateAdminProfile = async (
    adminId: string,
    data: { firstName: string; lastName: string; username: string; email: string }
  ): Promise<Profile> => {
    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== Role.ADMIN) {
      throw new Error("Admin account not found.");
    }
    return this.updateProfile(adminId, data);
  };
}
