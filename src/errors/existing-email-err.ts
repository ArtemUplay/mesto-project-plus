import { ERROR_409 } from '../constants/constants';

export default class ExistingEmailError extends Error {
  public statusCode: number;

  constructor(messsage: string) {
    super(messsage);
    this.statusCode = ERROR_409;
  }
}
