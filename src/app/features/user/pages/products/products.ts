import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  products: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        console.log(res);
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
        this.toastService.show('Failed to load products.', 'error');
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
        this.toastService.show(`${product.title} added to cart successfully!`, 'success');

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
        this.toastService.show(
          'Failed to add product to cart. Please check login or permissions.',
          'error'
        );
        product.loadingCart = false;
      },
    });
  }

  onQuantityChange(product: any) {
    if (product.quantity < 1 || !product.quantity) {
      product.quantity = 1;
    }
  }
}
