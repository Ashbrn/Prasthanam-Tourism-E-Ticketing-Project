export class AppError extends Error {
  public code: string;
  public statusCode: number;

  constructor(code: string, message: string, statusCode: number = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const handleApiError = (error: any): { code: string; message: string } => {
  if (!error.response) {
    return {
      code: "NETWORK_ERROR",
      message: "Network error. Please check your connection.",
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return {
        code: "BAD_REQUEST",
        message: data.message || "Invalid request data",
      };
    case 401:
      return {
        code: "UNAUTHORIZED",
        message: data.message || "Please login to continue",
      };
    case 403:
      return {
        code: "FORBIDDEN",
        message: data.message || "You don't have permission to perform this action",
      };
    case 404:
      return {
        code: "NOT_FOUND",
        message: data.message || "Resource not found",
      };
    case 429:
      return {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      };
    case 500:
      return {
        code: "SERVER_ERROR",
        message: data.message || "Server error. Please try again later.",
      };
    default:
      return {
        code: "UNKNOWN_ERROR",
        message: data.message || "An unexpected error occurred",
      };
  }
};

export const logError = (error: any, context: string = "") => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    message: error.message,
    code: error.code,
    stack: error.stack,
  };

  console.error("[ERROR]", JSON.stringify(errorInfo, null, 2));

  if (process.env.NODE_ENV === "production") {
    try {
      navigator.sendBeacon("/api/logs/error", JSON.stringify(errorInfo));
    } catch (e) {
    }
  }
};

export const createErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return "An unexpected error occurred";
};
