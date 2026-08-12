import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { CompanyComponent } from './company/company.component';
import { PosBrandComponent } from './pos-brand/pos-brand.component';
import { PosCategoryComponent } from './pos-category/pos-category.component';
import { PosProductsComponent } from './pos-products/pos-products.component';
import { PosroductBatchComponent } from './posroduct-batch/posroduct-batch.component';

const routes: Routes = [

 
  {
    path: 'company',
    component: CompanyComponent,
    data: {
      title: 'company-settings'
    }
  },
  {
    path: 'brand',
    component: PosBrandComponent
  },
  {
    path:'category',
    component:PosCategoryComponent
  },
  {
    path:'product',
    component:PosProductsComponent

  },
  {
    path:'batch',
    component:PosroductBatchComponent

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
