import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubcategoryService } from '../../subcategory.service';
import { CategoryService } from '../../../categories/category.service';
import { Subcategory } from '../../subcategory.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { Category } from '../../../categories/category.model';

@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subcategory-form.html',
})
export class SubcategoryForm implements OnInit {
  @Input() data?: Subcategory;
  @Output() close = new EventEmitter<{ updated?: boolean; subcategory?: Subcategory }>();

  form: FormGroup;
  categories: Category[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
    });
  }

  private getCategoryId(category: string | Category): string {
    return typeof category === 'object' ? category.id : category;
  }

  ngOnInit() {
    this.loadCategories(() => {
      if (this.data) {
        this.form.patchValue({
          name: this.data.name,
          category: this.getCategoryId(this.data.category),
        });
      }
    });
  }

  loadCategories(afterLoad?: () => void) {
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.categories = cats;
        afterLoad?.();
      },
      error: () => this.toast.show('Failed to load categories', 'error'),
    });
  }

  save() {
    if (this.form.invalid) {
      this.toast.show('Please fill all required fields', 'error');
      return;
    }

    this.loading = true;

    const payload: { name: string; category: string } = {
      name: this.form.value.name.trim(),
      category: this.form.value.category,
    };

    const request = this.data
      ? this.subcategoryService.update(this.data.id, payload)
      : this.subcategoryService.create(payload);

    request.subscribe({
      next: (subcategory) => {
        this.toast.show(
          this.data ? 'Subcategory updated successfully' : 'Subcategory created successfully',
          'success'
        );

        // ✅ Convert category ID → category object (so UI shows name)
        if (typeof subcategory.category === 'string') {
          const matchedCategory = this.categories.find((cat) => cat.id === subcategory.category);
          if (matchedCategory) subcategory.category = matchedCategory;
        }

        // ✅ Emit the fixed subcategory to parent
        this.close.emit({ updated: true, subcategory });
      },
      error: (err) => {
        this.loading = false;
        console.error('API Error:', err);
        this.toast.show('Something went wrong', 'error');
      },
      complete: () => (this.loading = false),
    });
  }
}
