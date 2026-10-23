import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  product: Product | null = null;
  productId!: string;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProductDetails();
    } else {
      this.errorMessage = 'Invalid product ID provided.';
      this.isLoading = false;
    }
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Product not found.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  navigateToEdit(): void {
    if (this.product?.id) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  async onDelete(): Promise<void> {
    if (!this.product?.id) return;

    const confirmed = await this.notificationService.confirmDelete(this.product.name);
    if (!confirmed) return;

    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Product "${this.product?.name}" was deleted successfully.`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.notificationService.showError(`Failed to delete product: ${err.message}`);
      }
    });
  }
}
