import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  passwordConfirm = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.passwordConfirm
    ) {
      this.error = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = null;

    const body = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
    };

    this.authService.register(body).subscribe({
      next: () => {
        this.loading = false;
        //  Auto-login and redirect handled in AuthService.register()
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
