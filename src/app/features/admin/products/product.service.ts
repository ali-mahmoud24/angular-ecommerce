import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private endpoint = 'products';

  constructor(private http: HttpService) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endpoint);
  }

  create(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.endpoint, data);
  }

  update(id: string, data: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
