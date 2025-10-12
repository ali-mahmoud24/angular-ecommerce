import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from './brand.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private endpoint = 'brands';

  constructor(private http: HttpService) {}

  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.endpoint);
  }

  create(data: FormData): Observable<Brand> {
    return this.http.post<Brand>(this.endpoint, data);
  }

  update(id: string, data: FormData): Observable<Brand> {
    return this.http.put<Brand>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
