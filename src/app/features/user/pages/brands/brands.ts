import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandService } from '../../../../core/services/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brands.html',
    styleUrls: ['./brands.css']
})
export class BrandsComponent implements OnInit {
  private brandService = inject(BrandService);

  brands: any[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.fetchBrands();
  }

  fetchBrands() {
    this.loading = true;
    this.error = null;

    this.brandService.getBrands().subscribe({
      next: (res: any) => {
        console.log('Fetched brands:', res);
        this.brands = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load brands.';
        this.loading = false;
      },
    });
  }
}
