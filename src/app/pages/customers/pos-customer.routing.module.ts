import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { PosCustomerComponent } from './pos-customer/pos-customer.component';


const routes: Routes = [
  {
    path: 'pos-customer',
    component: PosCustomerComponent,
    data: {
      title: 'Product Sales',
    }
  },



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosCustomerRoutingModule {}
