import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { UserRolesComponent } from './user-roles/user-roles.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'user-roles',
    component: UserRolesComponent,
    data: {
      title: 'user-roles',
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    data: {
      title: 'users',
    }
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessControlRoutingModule {}
