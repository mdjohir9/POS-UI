import {
  SideNavInterface
} from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [{
  path: '/dashboard',
  title: 'Dashboard',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: 'appstore-add',
  submenu: []
},

/* {
  path: '',
  title: 'Custommer',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: 'user',
  submenu: [
    {
      path: '/employee/add',
      title: 'Add-Custommer',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: '/employee/list',
      title: 'Custommer-List',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: '/employee/profile',
      title: 'Profile',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
   
  ]
}, */
{
  path: '',
  title: 'Custommer',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: 'user',
  submenu: [
    {
      path: 'custommer/add',
      title: 'Add-Custommer',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'custommer/list',
      title: 'Custommer List',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'custommer/profile',
      title: 'Custommer Profile',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
  ]
},


{
  path: '',
  title: 'Wallet',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: 'wallet',
  submenu: [
    {
      path: 'wallet/recharge',
      title: 'Recharge',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'wallet/recharge-requests',
      title: 'Recharge List',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'wallet/all-recharge',
      title: 'Recharge List',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'wallet/withdraw',
      title: 'Withdraw',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'wallet/all-withdraw',
      title: 'Withdraw',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'wallet/withdraw-bye-customer',
      title: 'Withdraw',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
  ]
},
/* {
  path:'',
  title:'Leave',
  iconType:'nzIcon',
  iconTheme:'outline',
  icon:'calendar',
  submenu:[{
    path: '/leave/application',
    title: 'LV-Application',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/leave/list',
    title: 'LV-List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/leave/approve',
    title: 'LV-Approve',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/leave/report',
    title: 'LV-Report',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  }
  ]
}, 
 */
{
  path:'',
  title:'Plans',
  iconType:'nzIcon',
  iconTheme:'outline',
  icon:'bar-chart',
  submenu:[{
    path: '/plans/loan-plans',
    title: 'Add-Plan',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/plans/loan-plan-list',
    title: 'Plan-List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  }
  ]
},
{
  path:'',
  title:'Loan',
  iconType:'nzIcon',
  iconTheme:'outline',
  icon:'stock',
  submenu:[
    {
      path: '/loan/add',
      title: 'New Loan Request',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
    path: '/loan/loan-request-list',
    title: 'Loan Request List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/loan/instalment',
    title: 'Instalments',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/loan/all-instalmets',
    title: 'Instalment List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: '/loan/loan-list',
    title: 'Loan List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
    {
    path: '/loan/customer-loan-request',
    title: 'Loan Application List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
    {
    path: '/loan/customer-loan-list',
    title: 'Loan List',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  ]
},
{
  path:'',
  title:'Settings',
  iconType:'nzIcon',
  iconTheme:'outline',
  icon:'setting',
  submenu:[{
    path: 'settings/company',
    title: 'Company',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
    {
      path: 'settings/paymentMethod',
      title: 'Payment Method',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
    {
      path: 'settings/recharge-accounts',
      title: 'Recharge Account',
      iconType: '',
      icon: '',
      iconTheme: '',
      submenu: []
    },
  /* 
  {
    path: 'settings/department',
    title: 'Department',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/designation',
    title: 'Designation',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/grade',
    title: 'Grade',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/shift',
    title: 'Shift',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/qualification',
    title: 'Qualification',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/religion',
    title: 'Religion',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/district',
    title: 'District',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/thana',
    title: 'Thana',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/line-group',
    title: 'Line Group',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  },
  {
    path: 'settings/others',
    title: 'Others',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  }, */
/*   {
    path: 'settings/floor',
    title: 'Floor',
    iconType: '',
    icon: '',
    iconTheme: '',
    submenu: []
  }, */
],
},

{
  path: '',
  title: 'access-control',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: 'lock',
  submenu: [{
      path: 'access-control/users',
      title: 'users',
      iconType: '',
      icon: '',

      iconTheme: '',
      submenu: []
    },
    {
      path: 'access-control/user-roles',
      title: 'Roles',
      iconType: '',
      icon: '',

      iconTheme: '',
      submenu: []
    },
  ]
}
]
