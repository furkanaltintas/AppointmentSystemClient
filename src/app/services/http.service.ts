import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/result.model';
import { api } from '../constants/urlconstants';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post<T>(
    apiUrl: string,
    body: any,
    callBack: (res: ResultModel<T>) => void,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    const url = `${api}${apiUrl}`;
    this.http.post<ResultModel<T>>(url, body).subscribe({
      next: (res) => {
        if (this.isValidResponse(res)) {
          callBack(res);
        } else {
          console.error('Invalid response data:', res);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, errCallBack);
      },
    });
  }

  get<T>(
    apiUrl: string,
    callBack: (res: ResultModel<T>) => void,
    params?: any,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    const url = `${api}${apiUrl}`;

    this.http.get<ResultModel<T>>(url, { params }).subscribe({
      next: (res) => {
        if (this.isValidResponse(res)) {
          callBack(res);
        } else {
          console.error('Invalid response data:', res);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, errCallBack);
      },
    });
  }

  private isValidResponse<T>(res: ResultModel<T>): boolean {
    return res && res.data !== undefined && res.data !== null;
  }

  private handleError(
    err: HttpErrorResponse,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    console.error('API error:', err);
    if (errCallBack) {
      errCallBack(err);
    } else {
      // Handle global error (logging, showing notification, etc.)
      console.error('An unexpected error occurred');
    }
  }
}
