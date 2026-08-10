import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'authentication',
        loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
    },
        {
        path: 'public',
        loadChildren: () => import('../../pages/public/public-module').then(m => m.PublicModule)
    }
];