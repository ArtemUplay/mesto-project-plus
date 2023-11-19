import { ERROR_401 } from "../constants/constants";

export default class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_401;
  }
}
