import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  errorMessage = '';

  // Filter & Search states
  searchTerm = '';
  selectedCategory = 'ALL';
  sortBy = 'name-asc';
  viewMode: 'grid' | 'table' = 'grid';

  // Statistics
  totalProducts = 0;
  totalInventoryValue = 0;
  lowStockCount = 0;

  private refreshSub!: Subscription;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Component communication: Listen for data modification events to auto-refresh
    this.refreshSub = this.productService.refreshNeeded$.subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data || [];
        this.computeStats();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load products from API server.';
        this.isLoading = false;
        this.notificationService.showError(this.errorMessage);
      }
    });
  }

  computeStats(): void {
    this.totalProducts = this.products.length;
    this.totalInventoryValue = this.products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 
      0
    );
    this.lowStockCount = this.products.filter(p => (Number(p.stock) || 0) < 15).length;
  }

  applyFilters(): void {
    let result = [...this.products];

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.sku && p.sku.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (this.selectedCategory !== 'ALL') {
      result = result.filter(p => p.category?.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc':
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'price-desc':
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'stock-desc':
          return (Number(b.stock) || 0) - (Number(a.stock) || 0);
        default:
          return 0;
      }
    });

    this.filteredProducts = result;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/create']);
  }

  navigateToEdit(id: string | number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/products/edit', id]);
    }
  }

  navigateToView(id: string | number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/products', id]);
    }
  }

  async onDelete(product: Product): Promise<void> {
    if (!product.id) return;

    const confirmed = await this.notificationService.confirmDelete(product.name);
    if (!confirmed) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Product "${product.name}" was successfully removed.`);
        // Note: loadProducts will be automatically invoked by refreshNeeded$ tap!
      },
      error: (err) => {
        this.notificationService.showError(`Could not delete product: ${err.message}`);
      }
    });
  }

  get categories(): string[] {
    const set = new Set<string>();
    this.products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }
}
