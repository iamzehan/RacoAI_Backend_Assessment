export class ApiResponse {
  static success(message: string, data?: unknown) {
    return {
      status: "success",
      message,
      data,
    };
  }

  static error(message: string, errors?: unknown) {
    return {
      status: "error",
      message,
      errors,
    };
  }
}