import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-details.html',
  styleUrls: ['./category-details.css']
})
export class CategoryDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  categoryId: string | null = null;
  category: any = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.fetchCategory(this.categoryId);
    } else {
      this.error = 'Invalid category ID.';
      this.loading = false;
    }
  }

  fetchCategory(id: string) {
    this.categoryService.getCategoryById(id).subscribe({
      next: (res) => {
        console.log('Fetched category:', res);
        this.category = res.data || res; // depending on API shape
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching category:', err);
        this.error = 'Failed to load category details.';
        this.loading = false;
      }
    });
  }
}
