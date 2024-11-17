import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDetailRoutingModule } from './customer-detail-routing.module';
import { CustomerDetailComponent } from './customer-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    CustomerDetailComponent
  ],
  imports: [
    CommonModule,
    CustomerDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CustomerDetailModule { }
