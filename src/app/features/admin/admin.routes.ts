import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin/admin-layout';
import { BrandList } from './brands/components/brand-list/brand-list';
import { CategoryList } from './categories/components/category-list/category-list';
import { SubcategoryList } from './subcategories/components/subcategory-list/subcategory-list';
import { CouponList } from './coupons/components/coupon-list/coupon-list';
import { ProductList } from './products/components/product-list/product-list';
import { UserList } from './users/components/user-list/user-list';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'brands', pathMatch: 'full' },
      { path: 'brands', component: BrandList },
      { path: 'categories', component: CategoryList },
      { path: 'subcategories', component: SubcategoryList },
      { path: 'coupons', component: CouponList },
      { path: 'products', component: ProductList },
      { path: 'users', component: UserList },
      { path: '**', redirectTo: 'brands' },
    ],
  },
];
