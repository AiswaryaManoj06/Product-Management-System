import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Products Inventory — ProductFlow'
  },
  {
    path: 'products',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'products/create',
    component: CreateProductComponent,
    title: 'Create Product — ProductFlow'
  },
  {
    path: 'products/edit/:id',
    component: EditProductComponent,
    title: 'Edit Product — ProductFlow'
  },
  {
    path: 'products/view/:id',
    redirectTo: 'products/:id',
    pathMatch: 'full'
  },
  {
    path: 'products/:id',
    component: ViewProductComponent,
    title: 'Product Details — ProductFlow'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
