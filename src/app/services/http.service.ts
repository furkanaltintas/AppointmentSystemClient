import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/result.model';
import { api, tokenKey } from '../constants/urlconstants';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  token: string = "";

  constructor(
    private http: HttpClient,
    private error: ErrorService
  ) {
    if(localStorage.getItem(tokenKey)) {
      this.token = localStorage.getItem(tokenKey) ?? "";
    }
  }

  post<T>(
    apiUrl: string,
    body: any,
    callBack: (res: ResultModel<T>) => void,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    const url = `${api}${apiUrl}`;
    this.http.post<ResultModel<T>>(url, body, {
      headers: {
        "Authorization": "Bearer " + this.token
      }
    }).subscribe({
      next: (res => {
          callBack(res);
      }),
      error: (err: HttpErrorResponse) => {
        this.error.errorHandler(err);
        this.handleError(err, errCallBack);
      },
    });
  }

  delete<T>(
    apiUrl: string,
    body: any,
    callBack: (res: ResultModel<T>) => void,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    const url = `${api}${apiUrl}`;
    this.http.delete<ResultModel<T>>(url, {body: body, headers: {
      "Authorization": "Bearer " + this.token
    }}).subscribe({
      next: (res) => {
        callBack(res);
    },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, errCallBack);
      },
    });
  }

  put<T>(
    apiUrl: string,
    body: any,
    callBack: (res: ResultModel<T>) => void,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    const url = `${api}${apiUrl}`;
    this.http.put<ResultModel<T>>(url, body, {
      headers: {
        "Authorization": "Bearer " + this.token
      }
    }).subscribe({
      next: (res) => {
        callBack(res);
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
    this.http.get<ResultModel<T>>(url, { params,
      headers: {
        "Authorization": "Bearer " + this.token
      }
     }).subscribe({
      next: (res) => {
        callBack(res);
    },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, errCallBack);
      },
    });
  }

  handleError(
    err: HttpErrorResponse,
    errCallBack?: (err: HttpErrorResponse) => void
  ): void {
    this.error.errorHandler(err);

    console.error('API error:', err);
    if (errCallBack !== undefined) {
      errCallBack(err);
    } else {
      // Handle global error (logging, showing notification, etc.)
      console.error('An unexpected error occurred');
    }
  }
}
