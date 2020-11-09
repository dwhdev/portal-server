declare namespace Express {
    interface Request {
        authUser: string;
        expiresIn: number;
    }
}