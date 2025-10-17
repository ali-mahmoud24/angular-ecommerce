import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';

interface CartItem {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  color: string;
  loading?: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  private productService = inject(ProductService);
  cart: CartItem[] = [];
  loading = true;
  error: string | null = null;
  totalCartPrice = 0;

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
    this.loading = true;
    this.productService.getCart().subscribe({
      next: (res: any) => {
        console.log('Fetched raw cart data:', res);

        const cartData = res.data || {};
        const items = cartData.cartItems || [];

        this.cart = items.map((item: any) => ({
          id: item._id,
          productId: item.product,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
        }));

        this.totalCartPrice = cartData.totalCartPrice || 0;
        console.log('Mapped cart:', this.cart);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
        this.error = 'Failed to load cart.';
        this.loading = false;
      },
    });
  }

  increaseQuantity(item: CartItem) {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }

  updateQuantity(item: CartItem, quantity: number) {
    item.loading = true;
    this.productService.updateCartItem(item.id, quantity).subscribe({
      next: () => {
        item.quantity = quantity;
        item.loading = false;
      },
      error: (err) => {
        console.error('Failed to update quantity:', err);
        item.loading = false;
      },
    });
  }

  removeItem(item: CartItem) {
    item.loading = true;
    this.productService.removeCartItem(item.id, item.color).subscribe({
      next: () => {
        this.cart = this.cart.filter((p) => p.id !== item.id);
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
      },
      complete: () => {
        item.loading = false;
      },
    });
  }

  clearCart() {
    this.loading = true;
    this.productService.clearCart().subscribe({
      next: () => {
        this.cart = [];
        this.totalCartPrice = 0;
      },
      error: (err) => {
        console.error('Failed to clear cart:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  get total() {
    return this.totalCartPrice || this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }
}
