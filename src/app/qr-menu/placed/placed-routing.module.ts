import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacedComponent } from './placed.component';

const routes: Routes = [{ path: '', component: PlacedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacedRoutingModule { }
