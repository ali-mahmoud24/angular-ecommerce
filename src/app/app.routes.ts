import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin/admin-layout';
import { BrandList } from './features/admin/brands/components/brand-list/brand-list';
import { CategoryList } from './features/admin/categories/components/category-list/category-list';

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

      // Repeat same pattern for other admin entities
      {
        path: 'categories',
        component: CategoryList,
      },
    ],
  },

  // USER layout (later)
  // {
  //   path: '',
  //   component: UserLayoutComponent,
  //   children: [...]
  // },

  { path: '**', redirectTo: 'admin' },
];
