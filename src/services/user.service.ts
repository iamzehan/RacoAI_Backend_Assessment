import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  constructor(private userRepository: UserRepository) {}
  // Profile
  profile = async (userId: string): Promise<Profile> => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found!");
    return {
      id: user?.id || userId,
      email: user?.email,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName
    };
  };
}
