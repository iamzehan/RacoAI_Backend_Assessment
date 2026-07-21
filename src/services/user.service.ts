import { User } from "../generated/prisma/client.js";
import { UserRepository } from "../repositories/user.repository.js";
import { Profile } from "../types/user.js";

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
}
