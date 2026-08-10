import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { ReachrageComponent } from './reachrage/reachrage.component';
import { RechargeRequestsComponent } from './recharge-requests/recharge-requests.component';
import { RequestsByeCustomerIdComponent } from './requests-ByeCustomer/requests-by-customer.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WithdrawRequestsComponent } from './withdraw-requests/withdraw-requests.component';
import { WithdrawByeCustomerIdComponent } from './withdraw-ByeCustomer/withdraw-by-customer.component';
import { RechargeUpdateComponent } from './recharge-update/recharge-update.component';
import { WithdrawUpdateComponent } from './withdraw-update/withdraw-update.component';
const routes: Routes = [
  {
    path: 'recharge',
    component: ReachrageComponent,
    data: {
      title: 'reacharge',
    }
  },
   {
    path: 'recharge-update/:id',
    component: RechargeUpdateComponent,
    data: {
      title: 'reacharge',
    }
  },
  {
    path: 'recharge-requests',
    component: RechargeRequestsComponent,
    data: {
      title: 'reacharge-admin',
    }
  },
  {
    path: 'all-recharge',
    component: RequestsByeCustomerIdComponent,
    data: {
      title: 'reacharge-user',
    }
  },
  {
    path: 'withdraw',
    component: WithdrawComponent,
    data: {
      title: 'withdraw-user',
    }
  },
     {
    path: 'withdraw-update/:id',
    component: WithdrawUpdateComponent,
    data: {
      title: 'reacharge',
    }
  },
  {
    path: 'all-withdraw',
    component: WithdrawRequestsComponent,
    data: {
      title: 'withdraw-user',
    }
  },
  {
    path: 'withdraw-bye-customer',
    component: WithdrawByeCustomerIdComponent,
    data: {
      title: 'withdraw-user',
    }
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
