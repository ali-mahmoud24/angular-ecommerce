import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BrandService {
    private http = inject(HttpClient);
    private API_URL = environment.apiUrl;

    // Get all brands
    getBrands(): Observable<any> {
        return this.http.get(`${this.API_URL}/brands`);
    }

    // Get brand by ID
    getBrandById(id: string): Observable<any> {
        return this.http.get(`${this.API_URL}/brands/${id}`);
    }
}
