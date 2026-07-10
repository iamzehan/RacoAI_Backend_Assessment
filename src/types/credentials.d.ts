import { Role } from "../generated/prisma/enums.ts";
// Token Credentials sent as cookie
interface TokenCredentials{
    user: {
        userId: string;
        email: string;
        role? : Role;
    },
    accessToken: string;
    refreshToken: string;
}
