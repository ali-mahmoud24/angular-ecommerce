import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
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

  // Available colors
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

  ngOnInit() {
    this.initForm();
    this.loadOptions();
    if (this.data) this.patchFormData();
  }

  /** Initialize Form */
  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      brand: [''],
      colors: this.fb.array([]),
      imageCover: this.data ? [''] : ['', Validators.required],
      images: [[]],
    });
  }

  /** Colors Getter **/
  get colorsArray() {
    return this.form.get('colors') as FormArray;
  }

  /** Toggle Color Checkboxes */
  toggleColor(color: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const colors = this.colorsArray;

    if (checked) {
      colors.push(new FormControl(color));
    } else {
      const i = colors.controls.findIndex((ctrl) => ctrl.value === color);
      if (i >= 0) colors.removeAt(i);
    }
  }

  /** Load Select Options */
  loadOptions() {
    this.categoryService.getAll().subscribe((res) => (this.categories = res));
    this.brandService.getAll().subscribe((res) => (this.brands = res));
  }

  /** Patch Edit-Mode Data */
  patchFormData() {
    const categoryId =
      typeof this.data.category === 'object'
        ? this.data.category.id
        : this.data.category;

    const brandId =
      typeof this.data.brand === 'object' ? this.data.brand.id : this.data.brand;

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

    this.imageCoverPreview = this.data.imageCoverUrl || null;
    this.imagePreviews = Array.isArray(this.data.imageUrls) ? [...this.data.imageUrls] : [];

    this.colorsArray.clear();
    if (Array.isArray(this.data.colors)) {
      this.data.colors.forEach((c: string) => this.colorsArray.push(new FormControl(c)));
    }
  }

  /** Cover Image Upload */
  onImageCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.form.patchValue({ imageCover: input.files[0] });

      const reader = new FileReader();
      reader.onload = () => (this.imageCoverPreview = reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  /** Additional Images Upload */
  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    this.form.patchValue({ images: files });

    this.imagePreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreviews.push(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  /** Remove Previewed Image */
  removeImage(index: number) {
    const files = this.form.value.images as File[];
    files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.form.patchValue({ images: files });
  }

  /** Submit Form */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fix validation errors.', 'error');
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('images', file);
        });
      } else if (Array.isArray(value)) {
        // ✅ Append colors as array properly
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else if (key === 'imageCover') {
        if (value instanceof File) formData.append('imageCover', value);
      } else {
        formData.append(key, value as any);
      }
    });

    const req$ = this.data
      ? this.productService.update(this.data.id, formData)
      : this.productService.create(formData);

    req$.subscribe({
      next: (updatedProduct) => {
        this.toast.show(
          this.data ? 'Product updated!' : 'Product created!',
          'success'
        );
        this.loading = false;
        this.close.emit({ updated: true, product: updatedProduct });
      },
      error: () => {
        this.toast.show('Something went wrong', 'error');
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
