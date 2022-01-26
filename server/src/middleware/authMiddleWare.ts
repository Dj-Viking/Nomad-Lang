import { verifyTokenAsync } from "../utils/verifyTokenAsync";
import { Response, NextFunction } from "express";
import { Express } from "../types";

export async function authMiddleware(
  req: Express.MyRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  // @ts-expect-error the header should be defined
  const token = req.headers.authorization.split(" ")[1] || null;
  if (!token) return res.status(401).json({ error: "not authenticated" });
  //verify token // TODO: compare old token to new token? for different secret signature?
  verifyTokenAsync(token)
    .then((decoded) => {
      if (decoded instanceof Error) return res.status(403).json({ error: decoded });
      else {
        req.user = decoded;
        return next();
      }
    })
    .catch();
}
