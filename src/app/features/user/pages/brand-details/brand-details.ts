import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../../core/services/brand.service';

@Component({
  selector: 'app-brand-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-details.html',
})
export class BrandDetailsComponent implements OnInit {
  private brandService = inject(BrandService);
  private route = inject(ActivatedRoute);

  brand: any = null;
  loading = false;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchBrandDetails(id);
    else this.error = 'Invalid brand ID.';
  }

  fetchBrandDetails(id: string) {
    this.loading = true;
    this.error = null;

    this.brandService.getBrandById(id).subscribe({
      next: (res: any) => {
        console.log('Brand details:', res);
        this.brand = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load brand details.';
        this.loading = false;
      },
    });
  }
}
