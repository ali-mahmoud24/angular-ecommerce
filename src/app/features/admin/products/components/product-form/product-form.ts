import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../categories/category.service';
import { BrandService } from '../../../brands/brand.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Brand } from '../../../brands/brand.model';
import { Category } from '../../../categories/category.model';
import { ProductService } from '../../product.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit, OnDestroy {
  @Input() data?: any;
  @Output() close = new EventEmitter<{ updated?: boolean; product?: Product }>();

  form!: FormGroup;
  categories: Category[] = [];
  brands: Brand[] = [];

  // Predefined color options
  colorOptions = ['red', 'green', 'blue', 'black', 'white', 'yellow', 'gray'];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private productService: ProductService,
    private toast: ToastService
  ) {}

  imagePreviews: string[] = [];

  imageCoverPreview: string | null = null;

  onImageCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.form.patchValue({ imageCover: file });

      const reader = new FileReader();
      reader.onload = () => (this.imageCoverPreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    this.form.patchValue({ images: files });

    this.imagePreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.imagePreviews.push(result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    const files = this.form.value.images as File[];
    files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.form.patchValue({ images: files });
  }

  ngOnInit() {
    this.initForm();
    this.loadOptions();
    if (this.data) this.patchFormData();
  }

  /** --------------------------
   *  INIT FORM
   * -------------------------- */
  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      brand: [''],
      colors: this.fb.array([]), // checkbox colors
      imageCover: this.data ? [''] : ['', Validators.required],
      images: [[]],
    });
  }

  get colorsArray() {
    return this.form.get('colors') as FormArray;
  }

  toggleColor(color: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const colors = this.colorsArray;

    if (checked) {
      colors.push(new FormControl(color));
    } else {
      const index = colors.controls.findIndex((ctrl) => ctrl.value === color);
      if (index >= 0) colors.removeAt(index);
    }
  }

  /** --------------------------
   *  LOAD OPTIONS
   * -------------------------- */
  loadOptions() {
    this.categoryService.getAll().subscribe((res) => (this.categories = res));
    this.brandService.getAll().subscribe((res) => (this.brands = res));
  }

  /** --------------------------
   *  PATCH DATA (EDIT)
   * -------------------------- */
  patchFormData() {
    const categoryId =
      typeof this.data.category === 'object' ? this.data.category.id : this.data.category;
    const brandId = typeof this.data.brand === 'object' ? this.data.brand.id : this.data.brand;

    this.form.patchValue({
      title: this.data.title,
      description: this.data.description,
      price: this.data.price,
      quantity: this.data.quantity,
      category: categoryId,
      brand: brandId || '',
      imageCover: '',
      images: [],
    });

    //  Reset previews then fill
    this.imageCoverPreview = this.data.imageCoverUrl || null;
    this.imagePreviews = Array.isArray(this.data.imageUrls) ? [...this.data.imageUrls] : [];

    //  Reset and patch colors cleanly
    this.colorsArray.clear();
    if (Array.isArray(this.data.colors)) {
      this.data.colors.forEach((color: string) => this.colorsArray.push(new FormControl(color)));
    }
  }

  /** --------------------------
   *  SUBMIT
   * -------------------------- */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fix validation errors before saving.', 'error');
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Append all fields
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('images', file);
        });
      } else if (key === 'imageCover') {
        //  only append new imageCover if user selected one
        if (value instanceof File) formData.append('imageCover', value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    const request$ = this.data
      ? this.productService.update(this.data.id, formData)
      : this.productService.create(formData);

    request$.subscribe({
      next: (updatedProduct) => {
        this.toast.show(
          this.data ? 'Product updated successfully!' : 'Product created successfully!',
          'success'
        );

        //  Refresh UI previews with backend response
        this.imageCoverPreview = updatedProduct.imageCoverUrl || null;
        this.imagePreviews = updatedProduct.imageUrls || [];

        this.loading = false;
        this.close.emit({ updated: true, product: updatedProduct });
      },
      error: () => {
        this.toast.show(
          this.data ? 'Failed to update product' : 'Failed to create product',
          'error'
        );
        this.loading = false;
      },
    });
  }

  ngOnDestroy() {
    this.imageCoverPreview = null;
    this.imagePreviews = [];
    this.form.reset();
  }
}
