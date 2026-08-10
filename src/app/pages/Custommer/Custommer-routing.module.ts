import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CustommerAddComponent } from './Add-custommer/Custommer-Add.component';
import { PersonnelInfoComponent } from './Add-custommer/Personnel-info';
import { CustommerContactComponent } from './Add-custommer/Custommer-Contact';
import { CustommerListComponent } from './custommer-list/custommer-list.component';
import { UpdatePersonnelInfoComponent } from './update-custommer/Update-Personnel-info';
import { CustommerUpdateComponent } from './update-custommer/Custommer-Update.component';
import { CustommerProfileComponent } from './custommer-profile/custommer-profile.component';

import { CustomerAddGuard, CustomerProfileMatch } from 'src/app/core/guards/router.guard';

const routes: Routes = [
  
  {
    path: 'add',
    component:CustommerAddComponent ,
    canActivate: [CustomerAddGuard],
    data: {
      title: 'Wizard One',
    },
 
  },
  {
    path: 'update/:id',  // Route for editing an existing customer
    component: CustommerUpdateComponent,
    data: { title: 'Edit Customer' },
  },
  {
    path: 'list',
    component:CustommerListComponent ,
    data: {
      title: 'Wizard One',
    },
 
  },
  {
    path: 'profile',
    component:CustommerProfileComponent ,
    canMatch: [CustomerProfileMatch],
    data: {
      title: 'Wizard One',
    },
 
  },
  {
    path: 'profile/:id',
    component:CustommerProfileComponent,
    data: {
      title: 'Wizard One',
    },
 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustommerRoutingModule { }
