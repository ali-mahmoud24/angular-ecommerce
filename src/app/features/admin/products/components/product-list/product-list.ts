import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../product.service';
import { Product } from '../../product.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { ProductForm } from '../product-form/product-form';
import { CategoryService } from '../../../categories/category.service';
import { BrandService } from '../../../brands/brand.service';
import { Category } from '../../../categories/category.model';
import { Brand } from '../../../brands/brand.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductForm],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  loading = true;
  showForm = false;
  selectedProduct?: Product;

  constructor(
    private service: ProductService,
    private toast: ToastService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadRelations();
  }

  loadProducts() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.toast.show('Failed to load products', 'error');
        this.loading = false;
      },
    });
  }

  loadRelations() {
    this.categoryService.getAll().subscribe((cats) => (this.categories = cats));
    this.brandService.getAll().subscribe((brands) => (this.brands = brands));
  }

  openForm(product?: Product) {
    this.selectedProduct = product;
    this.showForm = true;
  }

  closeForm(event?: { updated?: boolean; product?: Product }) {
    this.showForm = false;
    if (!event?.updated) return;

    if (this.selectedProduct && event.product) {
      const index = this.products.findIndex((p) => p.id === this.selectedProduct!.id);
      if (index !== -1) this.products[index] = event.product;
    } else if (event.product) {
      this.products.unshift(event.product);
    }

    this.selectedProduct = undefined;
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== id);
        this.toast.show('Product deleted successfully', 'success');
      },
      error: () => this.toast.show('Failed to delete product', 'error'),
    });
  }
}
