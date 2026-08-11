import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { ProductPurchaseComponent } from './product-purchase/product-purchase.component';
import { ProductPurchesListComponent } from './product-purches-list/product-purches-list.component';



const routes: Routes = [
  {
    path: 'product-purchase',
    component: ProductPurchaseComponent,
    data: {
      title: 'Product Purchase',
    }
  },


  {
    path: 'product-purchase-list',
    component: ProductPurchesListComponent,
    data: {
      title: 'Product Purchase List',
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
