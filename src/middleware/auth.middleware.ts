import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      projectId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.PROJECT_SECRET) {
    throw new Error("PROJECT_SECRET not configured");
  }
  try {
    if (!req.cookies) {
      return res.status(500);
    }
    const token = req.cookies.projectToken;
    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }
    const decoded = jwt.verify(token, process.env.PROJECT_SECRET) as {
      projectId: string;
    };
    req.projectId = decoded.projectId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired token" });
  }
};
