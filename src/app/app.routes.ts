import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin/admin-layout';
import { BrandList } from './features/admin/brands/components/brand-list/brand-list';
import { CategoryList } from './features/admin/categories/components/category-list/category-list';
import { SubcategoryList } from './features/admin/subcategories/components/subcategory-list/subcategory-list';
import { CouponList } from './features/admin/coupons/components/coupon-list/coupon-list';
import { ProductList } from './features/admin/products/components/product-list/product-list';
import { UserList } from './features/admin/users/components/user-list/user-list';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'brands', pathMatch: 'full' },

      {
        path: 'brands',
        component: BrandList,
      },

      {
        path: 'categories',
        component: CategoryList,
      },
      {
        path: 'subcategories',
        component: SubcategoryList,
      },
      {
        path: 'coupons',
        component: CouponList,
      },
      {
        path: 'products',
        component: ProductList,
      },
      {
        path: 'users',
        component: UserList,
      },
    ],
  },

  // USER layout
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./features/user/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: '',
        loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
      },
      { path: '**', redirectTo: '' },
    ],
  },

  { path: '**', redirectTo: 'admin' },
];
