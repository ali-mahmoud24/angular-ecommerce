import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Build full endpoint path */
  private getUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  /** Handle API errors */
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => error.error?.message || 'Something went wrong');
  }

  /** Extract the real data (handles paginated responses automatically) */
  private extractData<T>(response: any): T {
    if (response?.data) return response.data as T;
    return response as T;
  }

  /** Generic GET */
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, value as string);
      });
    }

    return this.http
      .get(this.getUrl(endpoint), { params: httpParams })
      .pipe(map((res) => this.extractData<T>(res)), catchError(this.handleError));
  }

  /** POST */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post(this.getUrl(endpoint), body)
      .pipe(map((res) => this.extractData<T>(res)), catchError(this.handleError));
  }

  /** PUT */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put(this.getUrl(endpoint), body)
      .pipe(map((res) => this.extractData<T>(res)), catchError(this.handleError));
  }

  /** DELETE */
  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete(this.getUrl(endpoint))
      .pipe(map((res) => this.extractData<T>(res)), catchError(this.handleError));
  }
}
