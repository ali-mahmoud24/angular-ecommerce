import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent implements OnInit {
  mobileMenuOpen = false;
  user: any = null;
  private sub?: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Subscribe to user changes
    this.sub = this.authService.user$.subscribe(u => {
      this.user = u;
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    // Use AuthService to clear user and redirect
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
