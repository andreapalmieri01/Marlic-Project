import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//IMPORT COMPONENT
import { LoginComponent } from './components/authentication/auth_user/login/login.component';
import { AuthGuard } from './components/authentication/services/auth.guard';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { PolimeriComponent } from './components/pages/dashboard/polimeriComponent/polimeri.component';
import { AdditiviComponent } from './components/pages/dashboard/additiviComponent/additivi.component';
import { AccountComponent } from './components/pages/dashboard/account/account.component';
import { RinforziComponent } from './components/pages/dashboard/rinforziComponent/rinforzi.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: 'additivi', component: AdditiviComponent,
      },
      {
        path: 'polimeri', component: PolimeriComponent,
      },
      {
        path: 'rinforzi', component: RinforziComponent,
      },
    ]
  },
  { path: 'login-user', component: LoginComponent },
  {
    path: 'dashboard/user', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'polimeri', component: PolimeriComponent, canActivate: [AuthGuard],
      },
      {
        path: 'additivi', component: AdditiviComponent, canActivate: [AuthGuard],
      },
      {
        path: 'rinforzi', component: RinforziComponent, canActivate: [AuthGuard],
      },
      {
        path: 'account', component: AccountComponent, canActivate: [AuthGuard],
      },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
