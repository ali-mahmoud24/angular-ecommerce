import { Brand } from '../brands/brand.model';
import { Category } from '../categories/category.model';
import { Subcategory } from '../subcategories/subcategory.model';

export interface Product {
  id: string;
  title: string;
  slug?: string;
  description: string;
  quantity: number;
  sold?: number;
  price: number;
  colors: string[];
  imageCover: string;
  images: string[];
  imageCoverUrl?: string;
  imageUrls?: string[];
  category: string | Category;
  subcategories: (string | Subcategory)[];
  brand: string | Brand;
  numOfRatings?: number;
  createdAt?: string;
  updatedAt?: string;
}
