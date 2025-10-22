import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  private productService = inject(ProductService);
  cart: CartItem[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
    this.loading = true;
    this.productService.getCart().subscribe({
      next: (res: any) => {
        const cartData = res.data || {};
        const items = cartData.cartItems || [];

        this.cart = items.map((item: any) => ({
          id: item._id,
          productId: item.product,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
        }));

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
    item.quantity = quantity;
    this.productService.updateCartItem(item.id, quantity).subscribe({
      next: () => {
        item.loading = false;
      },
      error: (err) => {
        console.error('Failed to update quantity:', err);
        item.loading = false;
        this.fetchCart();
      },
    });
  }

  removeItem(item: CartItem) {
    item.loading = true;
    const id = item.id;
    this.cart = this.cart.filter((p) => p.id !== id);

    this.productService.removeCartItem(id, item.color).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Failed to remove item:', err);
        this.fetchCart();
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
    return this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2);
  }
}
