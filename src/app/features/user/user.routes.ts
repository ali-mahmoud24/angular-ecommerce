import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { CartComponent } from './pages/cart/cart';
import { BrandsComponent } from './pages/brands/brands';
import { CategoriesComponent } from './pages/categories/categories';

export const USER_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'cart', component: CartComponent },

  // Details (lazy-loaded)
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details').then((m) => m.ProductDetailsComponent),
  },
  {
    path: 'categories/:id',
    loadComponent: () =>
      import('./pages/category-details/category-details').then((m) => m.CategoryDetailsComponent),
  },
  {
    path: 'brands/:id',
    loadComponent: () =>
      import('./pages/brand-details/brand-details').then((m) => m.BrandDetailsComponent),
  },
];
