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
                loadChildren: () => import('../../pages/pages.module').then(m => m.PagesModule)
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
        canMatch: [CustomerProfileMatch],
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
        path: 'custommer',
   
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
                loadChildren: () => import('../../pages/Custommer/Custommer.module').then(m => m.CustommerModule)
            },
        ]
    },

    {
        path: 'wallet',
        canMatch: [CustomerProfileMatch],
        data: {
            title: 'wallet'
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
                loadChildren: () => import('../../pages/wallet/wallet-module').then(m => m.WalletModule)
            },
        ]
    },

    {
        path: 'employee',
        data: {
            title: 'Employee '
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
                loadChildren: () => import('../../pages/employee/employee.module').then(m => m.EmployeeModule)
            },
        ]
    },

      // Charts


    {
        path: 'leave',
        data: {
            title:'leave'
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
                loadChildren:()=>import('../../pages/leave/leave-module').then(m=>m.LeaveModule)
            },
        ]
    }

];
