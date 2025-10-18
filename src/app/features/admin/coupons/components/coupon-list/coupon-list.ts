import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponService } from '../../coupon.service';
import { Coupon } from '../../coupon.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { CouponForm } from '../coupon-form/coupon-form';

@Component({
  selector: 'app-coupon-list',
  standalone: true,
  imports: [CommonModule, CouponForm],
  templateUrl: './coupon-list.html',
})
export class CouponList implements OnInit {
  coupons: Coupon[] = [];
  loading = true;
  selectedCoupon?: Coupon;
  showForm = false;

  constructor(private service: CouponService, private toast: ToastService) {}

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.coupons = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('Failed to load coupons', 'error');
      },
    });
  }

  openForm(coupon?: Coupon) {
    this.selectedCoupon = coupon;
    this.showForm = true;
  }

  closeForm(event?: { updated?: boolean; coupon?: Coupon }) {
    this.showForm = false;
    if (!event?.updated) return;

    if (this.selectedCoupon) {
      const index = this.coupons.findIndex((c) => c.id === this.selectedCoupon!.id);
      if (index !== -1 && event.coupon) this.coupons[index] = event.coupon;
    } else if (event.coupon) {
      this.coupons.unshift(event.coupon);
    }

    this.selectedCoupon = undefined;
  }

  delete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.coupons = this.coupons.filter((c) => c.id !== id);
        this.toast.show('Coupon deleted successfully', 'success');
      },
      error: () => this.toast.show('Failed to delete coupon', 'error'),
    });
  }
}
