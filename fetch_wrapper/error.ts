export class UnauthorizedError extends Error {
  constructor(
    message: string = "Unauthorized: Invalid or expired credentials",
  ) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
