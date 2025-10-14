import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin/admin-layout';
import { BrandList } from './features/admin/brands/components/brand-list/brand-list';
import { CategoryList } from './features/admin/categories/components/category-list/category-list';
import { SubcategoryList } from './features/admin/subcategories/components/subcategory-list/subcategory-list';

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
