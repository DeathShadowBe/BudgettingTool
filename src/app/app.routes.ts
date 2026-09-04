import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { TransactionsComponent } from './pages/transactions/transactions';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard]
  },
    {
    path: 'profile',
    component: ProfileComponent
    }

];