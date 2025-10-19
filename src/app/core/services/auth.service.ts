import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _user$ = new BehaviorSubject<User | null>(null);
    user$ = this._user$.asObservable();

    constructor(private http: HttpClient) {
        const raw = localStorage.getItem('user');
        if (raw) this._user$.next(JSON.parse(raw));
    }

    get currentUser(): User | null {
        return this._user$.value;
    }

    register(body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        passwordConfirm: string;
    }) {
        return this.http.post(`${environment.apiUrl}/auth/signup`, body);
    }

    login(credentials: { email: string; password: string }) {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
            tap(res => {
                if (res.token) {
                    const user: User = {
                        token: res.token,
                        firstName: res.user?.firstName,
                        lastName: res.user?.lastName,
                        email: res.user?.email
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    this._user$.next(user);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        this._user$.next(null);
    }
}
