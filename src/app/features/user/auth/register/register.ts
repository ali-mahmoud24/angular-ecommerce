import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  passwordConfirm = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim() || !this.password.trim() || !this.passwordConfirm.trim()) {
      this.toastService.show('All fields are required.', 'error');
      return;
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.toastService.show('Please enter a valid email address.', 'error');
      return;
    }

    if (this.password.length < 6) {
      this.toastService.show('Password must be at least 6 characters.', 'error');
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.toastService.show('Passwords do not match.', 'error');
      return;
    }

    this.loading = true;
    this.error = null;

    const body = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm
    };



    this.authService.register(body).subscribe({
      next: () => {
        this.loading = false;
        //  Auto-login and redirect handled in AuthService.register()
        this.toastService.show('Account created successfully!', 'success');

      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.toastService.show(this.error ?? 'Registration failed', 'error');

      },
    });
  }
}
