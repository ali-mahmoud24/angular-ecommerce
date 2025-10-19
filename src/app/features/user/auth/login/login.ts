import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    this.loading = true;
    this.error = null;

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Welcome back! 🎉');
        this.router.navigateByUrl('/home'); // ✅ Will now work properly
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
