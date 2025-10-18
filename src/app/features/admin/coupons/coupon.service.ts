import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from './coupon.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private endpoint = 'coupons';

  constructor(private http: HttpService) {}

  getAll(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.endpoint);
  }

  create(data: { name: string; category: string }): Observable<Coupon> {
    return this.http.post<Coupon>(this.endpoint, data);
  }

  update(id: string, data: { name: string; category: string }): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
