import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;

  availableCategories = [
    'Electronics',
    'Audio',
    'Wearables',
    'Accessories',
    'Photography',
    'Computers',
    'Gaming',
    'Home & Office'
  ];

  defaultImagePreview = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.pattern(/^[A-Z0-9-_]+$/i)]],
      imageUrl: [''],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  // Quick field getters for template validation
  get f() {
    return this.productForm.controls;
  }

  get currentImage(): string {
    return this.productForm.get('imageUrl')?.value || this.defaultImagePreview;
  }

  selectCategory(category: string): void {
    this.productForm.patchValue({ category });
    this.productForm.get('category')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.notificationService.showError('Please correct the highlighted form errors.');
      return;
    }

    this.isSubmitting = true;

    const newProduct: Product = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      stock: Number(this.productForm.value.stock),
      imageUrl: this.productForm.value.imageUrl || this.defaultImagePreview,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };

    this.productService.createProduct(newProduct).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.notificationService.showSuccess(
          `Product "${created.name}" was successfully added to inventory!`,
          'Product Created'
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notificationService.showError(err.message || 'Failed to create product.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
