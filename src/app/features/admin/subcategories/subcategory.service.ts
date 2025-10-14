import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subcategory } from './subcategory.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class SubcategoryService {
  private endpoint = 'subcategories';

  constructor(private http: HttpService) {}

  getAll(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(this.endpoint);
  }

  create(data: { name: string; category: string }): Observable<Subcategory> {
    return this.http.post<Subcategory>(this.endpoint, data);
  }

  update(id: string, data: { name: string; category: string }): Observable<Subcategory> {
    return this.http.put<Subcategory>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
