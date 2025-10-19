import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { User } from '../../user.model';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
})
export class UserForm {
  @Input() data?: User;
  @Output() close = new EventEmitter<{ updated?: boolean; user?: User }>();

  form: FormGroup;
  imageFile?: File;
  profileImagePreview?: string;
  loading = false;

  constructor(private fb: FormBuilder, private service: UserService, private toast: ToastService) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(01)[0-9]{9}$/)]], // Egyptian phone example
      role: ['', Validators.required],
      profileImage: [''],
      password: [''], // only used on create
    });
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        phone: this.data.phone,
        role: this.data.role,
      });
      this.profileImagePreview = this.data.profileImageUrl;

      // Remove password control on edit
      this.form.removeControl('password');
    } else {
      // Add password validators for creation
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.profileImagePreview = reader.result as string);
      reader.readAsDataURL(this.imageFile);
      this.form.patchValue({ profileImage: this.imageFile });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key === 'profileImage' && this.imageFile) {
        formData.append('profileImage', this.imageFile);
      } else if (key === 'profileImage') {
        //  only append new profileImage if user selected one
        if (value instanceof File) formData.append('profileImage', value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    formData.append('passwordConfirm', this.form.value['password']);

    const request = this.data
      ? this.service.update(this.data.id, formData)
      : this.service.create(formData);

    request.subscribe({
      next: (user) => {
        this.toast.show(
          this.data ? 'User updated successfully' : 'User created successfully',
          'success'
        );
        this.close.emit({ updated: true, user });
      },
      error: () => {
        this.loading = false;
        this.toast.show('Something went wrong', 'error');
      },
      complete: () => (this.loading = false),
    });
  }
}
