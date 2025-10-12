import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../brand.service';
import { Brand } from '../../brand.model';
import { BrandForm } from '../brand-form/brand-form';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, BrandForm],
  templateUrl: './brand-list.html',
  styleUrls: ['./brand-list.css'],
})
export class BrandList implements OnInit {
  brands: Brand[] = [];
  loading = true;
  selectedBrand?: Brand;
  showForm = false;

  constructor(private service: BrandService, private toast: ToastService) {}

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.brands = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openForm(brand?: Brand) {
    this.selectedBrand = brand;
    this.showForm = true;
  }

  //  Dynamically handle add / edit

  closeForm(event?: { updated?: boolean; brand?: Brand }) {
    this.showForm = false;
    if (!event?.updated) return;

    if (this.selectedBrand) {
      // Update existing
      const index = this.brands.findIndex((b) => b.id === this.selectedBrand!.id);
      if (index !== -1 && event.brand) this.brands[index] = event.brand;
    } else if (event.brand) {
      // Add new
      this.brands.unshift(event.brand);
    }

    this.selectedBrand = undefined;
  }

  //  Delete dynamically
  delete(id: string) {
    if (!confirm('Delete this brand?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.brands = this.brands.filter((b) => b.id !== id);
        this.toast.show('Brand deleted successfully', 'success');
      },
      error: () => this.toast.show('Failed to delete brand', 'error'),
    });
  }
}
