import { Request } from "express";

export interface Session extends Express.Session {
  userId?: String;
}

export interface Context {
  req: Request;
  res: Response;
}
