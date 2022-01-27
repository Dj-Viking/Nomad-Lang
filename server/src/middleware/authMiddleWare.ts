import { verifyTokenAsync } from "../utils/verifyTokenAsync";
import { Response, NextFunction } from "express";
import { Express, MyJwtData } from "../types";

export async function authMiddleware(
  req: Express.MyRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  if (!!req.headers) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "not authenticated" });
    }
  }
  // @ts-expect-error the header should be defined
  const token = req.headers.authorization.split(" ")[1] || null;
  if (!token) return res.status(401).json({ error: "not authenticated" });
  //verify token // TODO: compare old token to new token? for different secret signature?
  const decoded = await verifyTokenAsync(token);
  if (decoded instanceof Error) return res.status(403).json({ error: decoded });
  req.user = decoded as MyJwtData;
  return next();
}
