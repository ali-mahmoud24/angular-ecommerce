import { Routes } from '@angular/router';
import { UserLayout } from './layouts/user/user-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';

export const routes: Routes = [
  // Admin (lazy loaded)
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Public auth routes
  {
    path: 'auth',
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./features/user/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // User routes
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
      },
      { path: '**', redirectTo: 'home' },
    ],
  },
];
