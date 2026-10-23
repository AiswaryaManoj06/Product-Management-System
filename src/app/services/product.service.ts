import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly primaryUrl = 'http://localhost:3000/products';
  private readonly fallbackUrl = 'http://127.0.0.1:3000/products';
  private activeUrl = this.primaryUrl;

  // Subject for component communication to notify when data changes
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$(): Observable<void> {
    return this._refreshNeeded$.asObservable();
  }

  constructor(private http: HttpClient) {}

  /**
   * Fetch all products with automatic host fallback
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.activeUrl).pipe(
      catchError((err) => {
        if (err.status === 0 && this.activeUrl === this.primaryUrl) {
          this.activeUrl = this.fallbackUrl;
          return this.http.get<Product[]>(this.fallbackUrl);
        }
        return throwError(() => err);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch single product by id
   */
  getProductById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.activeUrl}/${id}`).pipe(
      catchError((err) => {
        if (err.status === 0 && this.activeUrl === this.primaryUrl) {
          this.activeUrl = this.fallbackUrl;
          return this.http.get<Product>(`${this.fallbackUrl}/${id}`);
        }
        return throwError(() => err);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new product and broadcast refresh notification
   */
  createProduct(product: Product): Observable<Product> {
    const payload: Product = {
      ...product,
      id: product.id ? String(product.id) : String(Date.now()),
      createdAt: product.createdAt || new Date().toISOString()
    };

    return this.http.post<Product>(this.activeUrl, payload).pipe(
      tap(() => this._refreshNeeded$.next()),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing product and broadcast refresh notification
   */
  updateProduct(id: string | number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.activeUrl}/${id}`, product).pipe(
      tap(() => this._refreshNeeded$.next()),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a product and broadcast refresh notification
   */
  deleteProduct(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.activeUrl}/${id}`).pipe(
      tap(() => this._refreshNeeded$.next()),
      catchError(this.handleError)
    );
  }

  /**
   * Manually trigger a refresh across listening components
   */
  notifyRefresh(): void {
    this._refreshNeeded$.next();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to JSON Server. Please ensure json-server is running on port 3000 (run `npm run server`).';
      } else {
        errorMessage = `Server returned code ${error.status}: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
