import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from './../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      this.toastService.show('Please fill in all fields.', 'error');
      return;
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.toastService.show('Please enter a valid email address.', 'error');
      return;
    }

    if (this.password.length < 6) {
      this.toastService.show('Password must be at least 6 characters long.', 'error');
      return;
    }

    this.loading = true;
    this.error = null;

    const credentials = {
      email: this.email,
      password: this.password
    };


    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.show('Welcome back!', 'success');

        //  AuthService handles redirection automatically based on role
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password';
        this.toastService.show(this.error ?? 'An unexpected error occurred', 'error');

      },
    });
  }
}
