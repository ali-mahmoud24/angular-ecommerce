import { Category } from '../categories/category.model';

export interface Subcategory {
  id: string;
  name: string;
  slug?: string;
  category: Category; // populated or id
  createdAt?: string;
  updatedAt?: string;
}
