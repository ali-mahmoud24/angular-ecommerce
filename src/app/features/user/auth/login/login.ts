import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in both fields.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        //  AuthService handles redirection automatically based on role
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password';
      },
    });
  }
}
