import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent() {
      return import('./components/login/login').then(m => m.LoginComponent);
    }
  },
  {
    path: '',
    loadComponent() {
      return import('./components/shared/page/page').then(m => m.PageComponent);
    },
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent() {
          return import('./components/home/home').then(m => m.HomeComponent);
        },
        canActivate: [roleGuard(['CUSTOMER'])]
      },
      {
        path: 'dashboard',
        loadComponent() {
          return import('./components/dashboard/dashboard').then(m => m.DashboardComponent);
        },
        canActivate: [roleGuard(['EMPLOYEE'])]
      },
      {
        path: 'contracts',
        loadComponent() {
          return import('./components/contract/contract').then(m => m.ContractsComponent);
        },
        canActivate: [roleGuard(['EMPLOYEE'])]
      },
      {
        path: 'history',
        loadComponent() {
          return import('./components/history/history').then(m => m.HistoryComponent);
        },
        canActivate: [roleGuard(['EMPLOYEE'])]
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent() {
          return import('./components/role-redirect/role-redirect').then(m => m.RoleRedirectComponent);
        }
      }
    ]
  },
  {
    path: '**',
    loadComponent() {
      return import('./components/not-implemented/not-implemented').then(m => m.NotImplementedComponent);
    }
  }
];
