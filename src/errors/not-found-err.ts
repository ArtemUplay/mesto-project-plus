import { ERROR_404 } from "../constants/constants";

export default class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_404;
  }
}
