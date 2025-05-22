import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  userId: string;
  username: string;
  email: string;
}

function isUserToken(decoded: any): decoded is User {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    typeof decoded.userId === "string"
  );
}

export function middleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" }); 
    return; 
  }

  jwt.verify(token, process.env.JWT_SECRET || "123123", (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" }); 
      return;
    }
  
    if (isUserToken(decoded)) {
      req.user = decoded;
      req.userId = decoded.userId;
      next();
    } else {
      console.error("Token structure invalid:", decoded);
      res.status(400).json({ message: "Invalid token" }); 
    }
  });
}
