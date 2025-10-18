import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CouponService } from '../../coupon.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Coupon } from '../../coupon.model';

@Component({
  selector: 'app-coupon-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coupon-form.html',
})
export class CouponForm implements OnInit {
  @Input() data?: Coupon;
  @Output() close = new EventEmitter<{ updated?: boolean; coupon?: Coupon }>();

  form: FormGroup;
  loading = false;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private service: CouponService,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      discount: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      expiryDate: ['', [Validators.required, this.futureDateValidator]],
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        discount: this.data.discount,
        expiryDate: this.data.expiryDate.split('T')[0],
      });
      this.form.get('name')?.disable(); // disable name on edit
    }
  }

  // Custom validator to prevent past dates
  futureDateValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    const today = new Date();
    const selected = new Date(value);
    return selected < new Date(today.toDateString()) ? { pastDate: true } : null;
  }

  save() {
    if (this.form.invalid) {
      this.toast.show('Please fill all required fields correctly', 'error');
      return;
    }

    this.loading = true;
    const payload = this.form.getRawValue(); // includes disabled controls

    const request = this.data
      ? this.service.update(this.data.id, payload)
      : this.service.create(payload);

    request.subscribe({
      next: (coupon) => {
        this.toast.show(
          this.data ? 'Coupon updated successfully' : 'Coupon created successfully',
          'success'
        );
        this.close.emit({ updated: true, coupon });
      },
      error: () => {
        this.toast.show('Something went wrong', 'error');
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
