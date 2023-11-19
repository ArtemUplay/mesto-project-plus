import { ERROR_400 } from '../constants/constants';

export default class BadRequestError extends Error {
  public statusCode: number;

  constructor(messsage: string) {
    super(messsage);
    this.statusCode = ERROR_400;
  }
}
