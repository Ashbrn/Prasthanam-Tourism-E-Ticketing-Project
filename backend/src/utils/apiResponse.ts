import { Response } from "express";

export class ApiResponse {
  public status: "success" | "error";
  public data?: any;
  public message?: string;
  public errors?: any[];

  constructor(status: "success" | "error", data?: any, message?: string, errors?: any[]) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.errors = errors;
  }

  static success(data?: any, message?: string) {
    return new ApiResponse("success", data, message);
  }

  static error(message: string, errors?: any[]) {
    return new ApiResponse("error", undefined, message, errors);
  }

  static created(data: any, message?: string) {
    return new ApiResponse("success", data, message || "Resource created successfully");
  }

  static updated(data: any, message?: string) {
    return new ApiResponse("success", data, message || "Resource updated successfully");
  }

  static deleted(message?: string) {
    return new ApiResponse("success", null, message || "Resource deleted successfully");
  }

  toJSON() {
    const response: any = {
      status: this.status,
    };

    if (this.data !== undefined) {
      response.data = this.data;
    }

    if (this.message) {
      response.message = this.message;
    }

    if (this.errors && this.errors.length > 0) {
      response.errors = this.errors;
    }

    return response;
  }
}

export const sendResponse = (res: Response, statusCode: number, response: ApiResponse) => {
  res.status(statusCode).json(response.toJSON());
};
