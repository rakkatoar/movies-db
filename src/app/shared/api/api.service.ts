import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL = environment.API_URL;
  API_TOKEN = environment.API_TOKEN;

  headers = new HttpHeaders()
    .set('Authorization', 'Bearer '+this.API_TOKEN)
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Accept', 'application/json');

  constructor(private httpClient: HttpClient) { }

  getDataApi(param: string): Observable<any> {
    return this.httpClient
      .get<any>(this.API_URL + param, {
        headers: this.headers,
        responseType: 'json',
      })
      .pipe(catchError(this.errorGetHandler.bind(this)));
  }

  errorGetHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'Data Not Found'));
  }

  errorHandler(error: HttpErrorResponse) {
    let message = error?.error?.message
      ? error?.error?.message
      : 'Something error in server';
    return throwError(() => new Error(message || 'Data Not Found'));
  }
}
