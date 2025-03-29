export class ResultModel<T> {
  data?: T | any;
  errorMessages?: string[];
  isSuccessful: boolean = true;
  statusCode: number = 200;
}

export type Unit = {};
