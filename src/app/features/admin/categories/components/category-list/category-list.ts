import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../catgory.service';
import { Category } from '../../category.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'app-catgory-list',
  imports: [CommonModule, CategoryForm],
  templateUrl: './category-list.html',
})
export class CategoryList implements OnInit {
  categories: Category[] = [];
  loading = true;
  selectedCategory?: Category;
  showForm = false;

  constructor(private service: CategoryService, private toast: ToastService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openForm(category?: Category) {
    this.selectedCategory = category;
    this.showForm = true;
  }

  //  Dynamically handle add / edit

  closeForm(event?: { updated?: boolean; category?: Category }) {
    this.showForm = false;
    if (!event?.updated) return;

    if (this.selectedCategory) {
      // Update existing
      const index = this.categories.findIndex((b) => b.id === this.selectedCategory!.id);
      if (index !== -1 && event.category) this.categories[index] = event.category;
    } else if (event.category) {
      // Add new
      this.categories.unshift(event.category);
    }

    this.selectedCategory = undefined;
  }

  //  Delete dynamically
  delete(id: string) {
    if (!confirm('Delete this category?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== id);
        this.toast.show('Category deleted successfully', 'success');
      },
      error: () => this.toast.show('Failed to delete category', 'error'),
    });
  }
}
