import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacedRoutingModule } from './placed-routing.module';
import { PlacedComponent } from './placed.component';
import { LottieModule } from 'ngx-lottie';


@NgModule({
  declarations: [
    PlacedComponent
  ],
  imports: [
    CommonModule,
    PlacedRoutingModule,
    LottieModule
  ]
})
export class PlacedModule { }
