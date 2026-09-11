import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { TransactionsComponent } from './pages/transactions/transactions';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile';
import { ImportTransactionsComponent } from './pages/import-transactions/import-transactions';
import { LeefbudgetDashboardComponent } from './pages/dashboards/leefbudget-dashboard/leefbudget-dashboard';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout';
import { CashflowDashboardComponent } from './pages/dashboards/cashflow-dashboard/cashflow-dashboard'

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
  },
  {
    path: 'import',
    component: ImportTransactionsComponent
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [

      {
        path: '',
        component: LeefbudgetDashboardComponent
      },
      {
        path: 'cashflow',
        component: CashflowDashboardComponent
      }
    ]
  }
];