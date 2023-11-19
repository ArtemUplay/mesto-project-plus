import { ERROR_403 } from '../constants/constants';

export default class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_403;
  }
}
