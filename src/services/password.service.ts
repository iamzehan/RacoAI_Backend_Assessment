import bcrypt from "bcrypt";
import { env } from "../config/env.js";

export class PasswordService {
    
    constructor(){}

    // password hash
    hashPassword = (password: string) => 
      bcrypt.hash(password, parseInt(env.PASSWORD_HASH_SALT));
    // compare passwords
    comparePassword = (password: string, hash: string) =>
      bcrypt.compare(password, hash);
}