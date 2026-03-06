import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", issues: err.issues });
  }

  console.error(err);
  return res.status(500).json({ message: "Unexpected server error" });
};

export default errorHandler;