import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const raw = localStorage.getItem('user');
    if (raw) {
      this._user$.next(JSON.parse(raw));
      this.redirectBasedOnRole();
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  get currentUser(): User | null {
    return this._user$.value;
  }

  get isLoggedIn(): boolean {
    return !!this._user$.value;
  }

  get isAdmin(): boolean {
    return this._user$.value?.role === 'admin';
  }

  /**  Register + Auto Login + Redirect */
  register(body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
    return this.http.post<any>(`${environment.apiUrl}/auth/signup`, body).pipe(
      tap((res) => {
        if (res.token) {
          const user: User = {
            token: res.token,
            firstName: res.user?.firstName,
            lastName: res.user?.lastName,
            email: res.user?.email,
            role: res.user?.role || 'user',
          };
          localStorage.setItem('user', JSON.stringify(user));
          this._user$.next(user);
          this.redirectBasedOnRole();
        }
      })
    );
  }

  /**  Login + Redirect */
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        console.log(res);
        if (res.token) {
          const user: User = {
            token: res.token,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            role: res.data.role || 'user',
          };
          localStorage.setItem('user', JSON.stringify(user));
          this._user$.next(user);
          this.redirectBasedOnRole();
        }
      })
    );
  }

  /**  Redirect logic */
  redirectBasedOnRole() {
    const user = this.currentUser;
    if (!user) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    if (user.role === 'admin') {
      this.router.navigateByUrl('/admin');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  /**  Logout */
  logout() {
    localStorage.removeItem('user');
    this._user$.next(null);
    this.router.navigateByUrl('/auth/login');
  }
}
