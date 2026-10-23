import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: string;
  originalProduct: Product | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

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
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();

    if (this.productId) {
      this.loadProductForEdit();
    } else {
      this.errorMessage = 'No product identifier provided.';
      this.isLoading = false;
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.pattern(/^[A-Z0-9-_]+$/i)]],
      imageUrl: [''],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  get f() {
    return this.productForm.controls;
  }

  get currentImage(): string {
    return this.productForm.get('imageUrl')?.value || this.originalProduct?.imageUrl || this.defaultImagePreview;
  }

  selectCategory(category: string): void {
    this.productForm.patchValue({ category });
    this.productForm.get('category')?.markAsTouched();
  }

  loadProductForEdit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.originalProduct = product;
        // Populate the form with fetched product details
        this.productForm.patchValue({
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          sku: product.sku || '',
          imageUrl: product.imageUrl || '',
          description: product.description
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load product details for editing.';
        this.isLoading = false;
        this.notificationService.showError(this.errorMessage);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.notificationService.showError('Please check the form for validation errors.');
      return;
    }

    this.isSubmitting = true;

    const updatedProduct: Product = {
      ...this.originalProduct,
      ...this.productForm.value,
      id: this.productId,
      price: Number(this.productForm.value.price),
      stock: Number(this.productForm.value.stock),
      imageUrl: this.productForm.value.imageUrl || this.defaultImagePreview
    };

    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.notificationService.showSuccess(
          `Product "${result.name}" has been updated successfully!`,
          'Changes Saved'
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notificationService.showError(err.message || 'Failed to update product.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
