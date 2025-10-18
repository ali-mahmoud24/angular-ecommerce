import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../subcategory.service';
import { Subcategory } from '../../subcategory.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { SubcategoryForm } from '../subcategory-form/subcategory-form';

@Component({
  selector: 'app-subcategory-list',
  standalone: true,
  imports: [CommonModule, SubcategoryForm],
  templateUrl: './subcategory-list.html',
})
export class SubcategoryList implements OnInit {
  subcategories: Subcategory[] = [];
  loading = true;
  selectedSubcategory?: Subcategory;
  showForm = false;

  constructor(private service: SubcategoryService, private toast: ToastService) {}

  getCategoryName(sub: Subcategory): string {
    return typeof sub.category === 'object' ? sub.category.name : sub.category;
  }

  ngOnInit() {
    this.loadSubcategories();
  }

  loadSubcategories() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.subcategories = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openForm(subcategory?: Subcategory) {
    this.selectedSubcategory = subcategory;
    this.showForm = true;
  }

  closeForm(event?: { updated?: boolean; subcategory?: Subcategory }) {
    this.showForm = false;
    if (!event?.updated) return;

    if (this.selectedSubcategory) {
      const index = this.subcategories.findIndex((b) => b.id === this.selectedSubcategory!.id);
      if (index !== -1 && event.subcategory) this.subcategories[index] = event.subcategory;
    } else if (event.subcategory) {
      this.subcategories.unshift(event.subcategory);
    }

    this.selectedSubcategory = undefined;
  }

  delete(id: string) {
    if (!confirm('Delete this subcategory?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.subcategories = this.subcategories.filter((c) => c.id !== id);
        this.toast.show('Subcategory deleted successfully', 'success');
      },
      error: () => this.toast.show('Failed to delete subcategory', 'error'),
    });
  }
}
