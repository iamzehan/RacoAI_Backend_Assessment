interface UserInput {
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