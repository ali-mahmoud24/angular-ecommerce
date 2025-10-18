import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './category.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private endpoint = 'categories';

  constructor(private http: HttpService) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.endpoint);
  }

  getOneById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.endpoint}/${id}`);
  }

  create(data: FormData): Observable<Category> {
    return this.http.post<Category>(this.endpoint, data);
  }

  update(id: string, data: FormData): Observable<Category> {
    return this.http.put<Category>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
