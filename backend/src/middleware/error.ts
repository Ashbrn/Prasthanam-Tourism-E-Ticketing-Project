import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors,
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};
