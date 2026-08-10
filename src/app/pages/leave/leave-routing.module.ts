import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveApproveComponent } from './leave-approve/leave-approve.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';



const routes: Routes = [
  {
    path: 'application',
    component: LeaveApplicationComponent,
    data: {
      title: 'leave',
    }
  },
  {
    path: 'list',
    component: LeaveListComponent,
    data: {
      title: 'LV-List',
    }
  },
  {
    path: 'approve',
    component: LeaveApproveComponent,
    data: {
      title: 'LV-Approve',
    }
  },
  {
    path: 'report',
    component: LeaveReportComponent,
    data: {
      title: 'LV-Report',
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRoutingModule {}
