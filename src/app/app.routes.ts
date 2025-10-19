import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin/admin-layout';
import { BrandList } from './features/admin/brands/components/brand-list/brand-list';
import { CategoryList } from './features/admin/categories/components/category-list/category-list';
import { SubcategoryList } from './features/admin/subcategories/components/subcategory-list/subcategory-list';
import { CouponList } from './features/admin/coupons/components/coupon-list/coupon-list';
import { ProductList } from './features/admin/products/components/product-list/product-list';
import { UserList } from './features/admin/users/components/user-list/user-list';
import { UserLayout } from './layouts/user/user-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';

export const routes: Routes = [
  //  Admin section
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
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

  //  User layout
  {
    path: '',
    component: UserLayout,
    children: [
      // Public routes (auth)
      {
        path: 'auth',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./features/user/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },

      // Protected user routes
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
      },

      { path: '**', redirectTo: 'home' },
    ],
  },
];
