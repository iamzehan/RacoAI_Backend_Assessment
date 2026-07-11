import { Role } from "../generated/prisma/enums.ts";

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    email: string;
    password: string;
}

// User Profile

interface Profile {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: Role
}

// User Login 
interface UserLogin {
    email: string;
    password: string;
}