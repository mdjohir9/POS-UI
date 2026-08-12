import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CustomerProfileMatch } from 'src/app/core/guards/router.guard';

export const CommonLayout_ROUTES: Routes = [

    //Dashboard
    {
        canActivate: [AuthGuard],
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        
    },


    {
        path: 'access-control',
        data: {
            title:'access-control'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path:'',
                redirectTo:'/dashboard',
                pathMatch:'full'
            },
            {
                path: '',
                loadChildren:()=>import('../../pages/access-control/access-contro.module').then(m=>m.AccessControlModule)
            },
        ]
    } ,

    //Pages
    {
        path: 'settings',
        data: {
            title: 'settings '
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: '',
                loadChildren: () => import('../../pages/settings/pages.module').then(m => m.PagesModule)
            },
        ]
    },
    {
        path: 'plans',
        data: {
            title: 'plans '
        },
       canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: '',
                loadChildren: () => import('../../pages/plans/plans-module').then(m => m.PlansModule)
            },
        ]
    },

    {
      //  canMatch: [CustomerProfileMatch],
        path: 'loan',
        data: {
            title: 'Loan'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: '',
                loadChildren: () => import('../../pages/loans/loan-module').then(m => m.LoansModule)
            },
        ]
    },

    {
        canMatch: [CustomerProfileMatch],
        path: 'sales',
        data: {
            title: 'Sales'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: '',
                loadChildren: () => import('../../pages/sales/sales-module').then(m => m.SalesModule)
            },
        ]
    },
    {
        canMatch: [CustomerProfileMatch],
        path: 'inventory',
        data: {
            title: 'Inventory'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: '',
                loadChildren: () => import('../../pages/inventory/inventory-module').then(m => m.InventoryModule)
            },
        ]
    },

        {
        canMatch: [CustomerProfileMatch],
        path: 'customers',
        data: {
            title: 'Customers'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: '',
                loadChildren: () => import('../../pages/customers/pos-customer.module').then(m => m.PosCustomerModule)
            },
        ]
    },

    

      // Charts


  
];
