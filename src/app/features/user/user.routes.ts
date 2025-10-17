import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout';
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { CartComponent } from './pages/cart/cart';
import { AuthGuard } from '../../core/guard/auth.guard';
import { BrandsComponent } from './pages/brands/brands';
import { CategoriesComponent } from './pages/categories/categories';

export const USER_ROUTES: Routes = [
    // Redirect root to home (you can change this later)
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // Auth routes (login/register)
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    },

    // Protected / main layout routes
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            // Common pages (eagerly loaded)
            { path: 'home', component: HomeComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: 'brands', component: BrandsComponent },
            { path: 'cart', component: CartComponent },

            // Lazy-loaded standalone pages (detail or secondary views)
            { path: 'product/:id', loadComponent: () => import('./pages/product-details/product-details').then(m => m.ProductDetailsComponent) },
            { path: 'categories/:id', loadComponent: () => import('./pages/category-details/category-details').then(m => m.CategoryDetailsComponent) },
            { path: 'brands/:id', loadComponent: () => import('./pages/brand-details/brand-details').then(m => m.BrandDetailsComponent) },
        ],
    },
];
