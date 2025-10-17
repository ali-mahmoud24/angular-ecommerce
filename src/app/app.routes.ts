import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/user/auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./features/user/user.routes').then(m => m.USER_ROUTES),
    },
    { path: '**', redirectTo: '' },
];
