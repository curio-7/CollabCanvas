import { Request } from "express";

declare global {
    namespace Express {
        interface User {
        userId : string;
        username : string;
        email : string;
        }
        interface Request {
            user?: User; // Make 'user' optional in case it's not set on the request
            userId?: string; // Add userId to the request object, here we are extending the request object to include userId
        }
    }
}
