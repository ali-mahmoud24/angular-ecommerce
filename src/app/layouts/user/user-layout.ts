import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './user-layout.html',
})
export class UserLayout implements OnInit {
  private sub?: Subscription;
  mobileMenuOpen = false;
  user: any = null;

  authService = inject(AuthService);

  ngOnInit() {
    // Subscribe to user changes
    this.sub = this.authService.user$.subscribe((u) => {
      this.user = u;
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    // Use AuthService to clear user and redirect
    this.authService.logout();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
