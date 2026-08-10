import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { LoanRequersListComponent } from './loan-request-list/loan-request-list.component';
import { AddLoansComponent } from './add-loans/add-loans.component';
import { ApproveLoanComponent } from './approve-loan/approve-loan.component';
import { LoanInstalmentComponent } from './loan-instalment/loan-instalment.component';
import { AllLoanInstalmentComponent } from './all-loan-instalment/all-loan-instalment.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanTramsAndConditionComponent } from './loan-trams-and-condition/loan-trams-and-condition.component';
import { LoanApplicationComponent } from './wizard-loan-application/loanApplication.component';
import { LoanRequestListCustomerComponent } from './customer/loan-request-list-customer/loan-request-list-customer.component';
import { LoanListCustomerComponent } from './customer/loan-list-customer/loan-list-customer.component';
const routes: Routes = [
  {
    path: 'loan-request-list',
    component: LoanRequersListComponent,
    data: {
      title: 'Loan-List',
    }
  },
  
  {
    path: 'approve/:id',  // Route for editing an existing customer
    component: ApproveLoanComponent,
    data: { title: 'Approve Loan' },
  },
    {
    path: 'condition',
    component: LoanTramsAndConditionComponent,
    data: {
      title: 'Add-loan',
    }
  },
  
  {
    path: 'add',
    component: AddLoansComponent,
    data: {
      title: 'Add-loan',
    }
  },
  {
    path: 'instalment',
    component: LoanInstalmentComponent,
    data: {
      title: 'Add-loan',
    }
  },
  {
    path: 'instalment/:id',
    component: LoanInstalmentComponent,
    data: {
      title: 'Add-loan',
    }
  },
  {
    path: 'all-instalmets',
    component: AllLoanInstalmentComponent,
    data: {
      title: 'All-recharge',
    }
  },
  {
    path: 'loan-list',
    component: LoanListComponent,
    data: {
      title: 'All-recharge',
    }
  },
    {
    path: 'customer-loan-list',
    component: LoanListCustomerComponent,
    data: {
      title: 'Loan-List',
    }
  },
     {
    path: 'customer-loan-request',
    component: LoanRequestListCustomerComponent,
    data: {
      title: 'Loan-requset-List',
    }
  },
    {
    path: 'loan-Application',
    component: LoanApplicationComponent,
    data: {
      title: 'All-recharge',
    }
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoansRoutingModule {}
