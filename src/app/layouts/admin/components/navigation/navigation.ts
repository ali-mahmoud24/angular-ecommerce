import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
})
export class Navigation {
  @Output() closeMenu = new EventEmitter<void>();

  menu = [
    { label: 'Brands', icon: 'store', route: '/admin/brands' },
    { label: 'Categories', icon: 'category', route: '/admin/categories' },
    { label: 'Subcategories', icon: 'account_tree', route: '/admin/subcategories' },
    { label: 'Products', icon: 'inventory_2', route: '/admin/products' },
    { label: 'Coupons', icon: 'sell', route: '/admin/coupons' },
    { label: 'Users', icon: 'people', route: '/admin/users' },
  ];

  closeSidebar() {
    this.closeMenu.emit();
  }
}
