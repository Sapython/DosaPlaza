import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo:'qr/start',
    pathMatch:'full'
  },
  { path: 'qr', loadChildren: () => import('./qr-menu/qr-menu.module').then(m => m.QrMenuModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
