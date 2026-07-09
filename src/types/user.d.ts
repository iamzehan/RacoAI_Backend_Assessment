interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    email: string;
    password: string;
}

// Token Credentials sent as cookie
interface TokenCredentials{
    user: {
        userId: string;
        email: string;
    },
    accessToken: string;
    refreshToken: string;
}

// User Profile

interface Profile {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}