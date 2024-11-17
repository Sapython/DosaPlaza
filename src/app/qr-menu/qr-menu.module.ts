import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrMenuRoutingModule } from './qr-menu-routing.module';
import { QrMenuComponent } from './qr-menu.component';




@NgModule({
  declarations: [
    QrMenuComponent
  ],
  imports: [
    CommonModule,
    QrMenuRoutingModule,
   
  ]
})
export class QrMenuModule { }
