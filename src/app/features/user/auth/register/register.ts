import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  passwordConfirm = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    this.loading = true;
    this.error = null;

    const body = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm
    };

    this.http.post(`${environment.apiUrl}/auth/signup`, body).subscribe({
      next: (res: any) => {
        console.log('Signup success:', res);
        this.loading = false;
        alert('Account created successfully!');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
