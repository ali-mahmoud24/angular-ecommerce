import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private http = inject(HttpClient);
    private API_URL = environment.apiUrl;

    // Fetch all products
    getProducts(): Observable<any> {
        return this.http.get(`${this.API_URL}/products`);
    }

    // Fetch single product by ID
    getProductsById(id: string): Observable<any> {
        return this.http.get(`${this.API_URL}/products/${id}`);
    }

    // Add product to cart
    addToCart(productId: string, color: string, quantity = 1): Observable<any> {
        const payload = { productId, color, quantity };
        return this.http.post(`${this.API_URL}/cart`, payload);
    }

    // Get logged user cart
    getCart(): Observable<any> {
        return this.http.get(`${this.API_URL}/cart`);
    }

    // Update cart item
    updateCartItem(id: string, quantity: number): Observable<any> {
        return this.http.put(`${this.API_URL}/cart/${id}`, { quantity });
    }

    // Remove cart item
    removeCartItem(id: string, color: string): Observable<any> {
        return this.http.delete(`${this.API_URL}/cart/${id}`, { body: { productId: id, color } });
    }

    // Clear cart
    clearCart(): Observable<any> {
        return this.http.delete(`${this.API_URL}/cart`);
    }
}
