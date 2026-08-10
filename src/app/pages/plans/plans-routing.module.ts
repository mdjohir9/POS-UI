import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { LoanPlansComponent } from './loan-plans/loan-plans.component';
import { LoanPlanListComponent } from './loan-plan-list/loan-plan-list.component';
import { UpdateLoanPlansComponent } from './update-loan-plans/update-loan-plans.component';


const routes: Routes = [
  {
    path: 'loan-plans',
    component: LoanPlansComponent,
    data: {
      title: 'Loan-Plans',
    }
  },

  {
    path: 'loan-plan-list',
    component: LoanPlanListComponent,
    data: {
      title: 'Loan-Plans',
    }
  },
  {
    path: 'update/:id',
    component: UpdateLoanPlansComponent,
    data: {
      title: 'Loan-Plans',
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlansRoutingModule {}
