import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingProductsComponent } from './pending-products/pending-products.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { CustomersComponent } from './customers/customers.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { CustomerIssuesComponent } from './customer-issues/customer-issues.component';
import { VendorsComponent } from './vendors/vendors.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { MaterialModule } from '../users/layouts/material/material.module';
import { AdminGuard } from '../guards/admin.guard';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    OrdersComponent,
    ProductsComponent,
    ViewOrderComponent,
    CustomersComponent,
    PendingProductsComponent,
    FeedbacksComponent, CustomerIssuesComponent, VendorsComponent, AddProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
          { path: 'dashboard', component : DashboardComponent,canActivate:[AdminGuard] },
          { path: 'orders', component : OrdersComponent,canActivate:[AdminGuard] },
          { path: 'products',
            children:[
              { path : '', component: ProductsComponent,canActivate:[AdminGuard]},
              {path: 'add', component : AddProductComponent,canActivate:[AdminGuard] },
            ]
          },
          { path:'pending-products', component:PendingProductsComponent,canActivate:[AdminGuard]},
          { path: 'orders/view', component : ViewOrderComponent,canActivate:[AdminGuard]},
          { path: 'customers', component : CustomersComponent,canActivate:[AdminGuard]},
          { path: 'feedbacks', component : FeedbacksComponent,canActivate:[AdminGuard] },
          { path: 'customer-issues', component : CustomerIssuesComponent,canActivate:[AdminGuard]},
          { path: 'vendors', component : VendorsComponent,canActivate:[AdminGuard]},
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]),
    MaterialModule
  ],
  exports : [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    OrdersComponent,
    ProductsComponent,
    ViewOrderComponent,
    CustomersComponent,
    PendingProductsComponent,
    FeedbacksComponent, CustomerIssuesComponent, VendorsComponent, AddProductComponent
  ]
})
export class AdminModule { }
