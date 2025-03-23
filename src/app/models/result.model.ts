export class ResultModel<T> {
  data?: T | any;
  errorMessage?: string[];
  isSuccessful: boolean = true;
  statusCode: number = 200;
}
