import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.html',
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product: any;
  loading = true;
  selectedImage: string | null = null;
  selectedColor: string | null = null;
  quantity = 1;
  addingToCart = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading = true;
    this.productService.getProductsById(id).subscribe({
      next: (res: any) => {
        this.product = res.data || res.product;
        this.selectedImage = this.product?.imageCoverUrl;
        this.selectedColor = this.product?.colors?.[0] || 'Default';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loading = false;
      },
    });
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }

  addToCart() {
    if (!this.product || this.addingToCart) return;
    this.addingToCart = true;

    const color = this.selectedColor || 'Default';
    this.productService.addToCart(this.product.id, color, this.quantity).subscribe({
      next: () => {
        alert(`${this.product.title} added to cart successfully!`);
        this.addingToCart = false;

        // Update localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(
          (p: any) => p.id === this.product.id && p.color === color
        );
        if (existing) {
          existing.quantity += this.quantity;
        } else {
          cart.push({ ...this.product, color, quantity: this.quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
        alert('Failed to add product to cart. Please check login or permissions.');
        this.addingToCart = false;
      },
    });
  }
}
