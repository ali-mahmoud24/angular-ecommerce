import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../brand.service';
import { Brand } from '../../brand.model';
import { ToastService } from '../../../../../core/services/toast.service'; // ✅ adjust path

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand-form.html',
})
export class BrandForm {
  @Input() data?: Brand;
  @Output() close = new EventEmitter<{ updated?: boolean; brand?: Brand }>();

  form: FormGroup;
  imageFile?: File;
  preview?: string;
  loading = false;

  constructor(private fb: FormBuilder, private service: BrandService, private toast: ToastService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({ name: this.data.name });
      this.preview = this.data.imageUrl;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.preview = reader.result as string);
      reader.readAsDataURL(this.imageFile);
    }
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    if (this.imageFile) formData.append('image', this.imageFile);

    const request = this.data
      ? this.service.update(this.data.id, formData)
      : this.service.create(formData);

    request.subscribe({
      next: (brand) => {
        this.toast.show(
          this.data ? 'Brand updated successfully' : 'Brand created successfully',
          'success'
        );
        this.close.emit({ updated: true, brand });
      },
      error: () => {
        this.loading = false;
        this.toast.show('Something went wrong', 'error');
      },
      complete: () => (this.loading = false),
    });
  }
}
