import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  products: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = (res.data || res.products || []).map((p: any) => ({
          ...p,
          selectedColor: p.colors?.[0] || 'Default',
          quantity: 1,
          loadingCart: false,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.loading = false;
      },
    });
  }

  addToCart(product: any) {
    if (product.loadingCart) return;
    product.loadingCart = true;

    const { id, selectedColor, quantity } = product;

    this.productService.addToCart(id, selectedColor, quantity).subscribe({
      next: () => {
        alert(`${product.title} added to cart successfully!`);

        // Sync localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(
          (p: any) => p.id === id && p.color === selectedColor
        );
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push({ ...product, color: selectedColor });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        product.loadingCart = false;
      },
      error: (err) => {
        console.error('Failed to add product to cart:', err);
        alert('Failed to add product to cart. Please check login or permissions.');
        product.loadingCart = false;
      },
    });
  }
}
