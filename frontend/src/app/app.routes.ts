import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Frontpage } from './frontpage/frontpage';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: LoginComponent },
  { path: 'frontpage', component: Frontpage},
  { path: '', redirectTo: '/frontpage', pathMatch: 'full' },
];