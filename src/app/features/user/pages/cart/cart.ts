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

  ngOnInit() {
    this.fetchCart();
  }

  /** Fetch all cart data from API */
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

  /** Increase quantity */
  increaseQuantity(item: CartItem) {
    this.updateQuantity(item, item.quantity + 1);
  }

  /** Decrease quantity (or remove if last) */
  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }

  /** Update quantity and total instantly, sync with backend */
  updateQuantity(item: CartItem, quantity: number) {
    item.loading = true;

    // ✅ instant local update
    item.quantity = quantity;

    // ✅ sync with backend
    this.productService.updateCartItem(item.id, quantity).subscribe({
      next: () => {
        item.loading = false;
      },
      error: (err) => {
        console.error('Failed to update quantity:', err);
        item.loading = false;

        // Optional rollback if you want accuracy
        this.fetchCart();
      },
    });
  }

  /** Remove an item instantly and sync with backend */
  removeItem(item: CartItem) {
    item.loading = true;
    const id = item.id;
    this.cart = this.cart.filter((p) => p.id !== id); // ✅ remove locally for instant UI update

    this.productService.removeCartItem(id, item.color).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Failed to remove item:', err);
        // Optional rollback if needed:
        this.fetchCart();
      },
      complete: () => {
        item.loading = false;
      },
    });
  }

  /** Clear the entire cart */
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

  /** ✅ Always calculate total live */
  get total() {
    return this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }
}
