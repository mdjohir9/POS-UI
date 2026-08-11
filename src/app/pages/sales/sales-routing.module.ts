import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { ProductSalesComponent } from './product-sales/product-sales.component';
import { ProductSalesListComponent } from './product-sales-list/product-sales-list.component';




const routes: Routes = [
  {
    path: 'product-sales',
    component: ProductSalesComponent,
    data: {
      title: 'Product Sales',
    }
  },


  {
    path: 'product-sales-list',
    component: ProductSalesListComponent,
    data: {
      title: 'Product Sales List',
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
