import {
    NgModule
  } from '@angular/core';
  import {
    Routes,
    RouterModule
  } from '@angular/router';
  import { AddEmployeeComponent } from './add-employee/add-employee.component';
  import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
  import { EmployeeListComponent } from './employee-list/employee-list.component';
  import { AddSeparetionComponent } from './separetion-add/add-separetion.component';
  import { SeparetionListComponent } from './separetion-list/separetion-list.component';

  const routes: Routes = [
   {
       path:'add',
       component:AddEmployeeComponent,
       data:{
         title:'add'
       }
     },
     {
       path:'list',
       component:EmployeeListComponent,
       data:{
         title:'list'
       }
     },
     {
       path:'profile',
       component:EmployeeProfileComponent,
       data:{
         title:'profile'
       }
     },
     {
       path:'separetion-add',
       component:AddSeparetionComponent,
       data:{
         title:'separetion'
       }
     },
     {
       path:'separetion-list',
       component:SeparetionListComponent,
       data:{
         title:'profile'
       }
     },
   
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class EmployeeRoutingModule {}
  