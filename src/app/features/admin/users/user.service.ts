import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private endpoint = 'users';

  constructor(private http: HttpService) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint);
  }

  create(data: FormData): Observable<User> {
    return this.http.post<User>(this.endpoint, data);
  }

  update(id: string, data: FormData): Observable<User> {
    return this.http.put<User>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
