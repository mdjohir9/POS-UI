import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardMatch, UserDashboardMatch } from '../core/guards/router.guard';

const routes: Routes = [
    {
      
        path: '',
        canMatch:[AdminDashboardMatch],
        component: AdminDashboardComponent,
        data: {
            title: 'Admin',
        }
    },
    {
        path: '',
        canMatch:[UserDashboardMatch],
        component: UserDashboardComponent,
        data: {
            title: 'User',
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {

}
