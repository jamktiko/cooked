import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Frontpage } from './frontpage/frontpage';
import { RecipeAdd } from './recipe-add/recipe-add';
import { RecipeDetail } from './recipe-detail/recipe-detail';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: LoginComponent },
  { path: 'frontpage', component: Frontpage },
  { path: '', redirectTo: '/frontpage', pathMatch: 'full' },
  { path: 'recipe/:id', component: RecipeDetail },
  {
    path: 'new-recipe',
    component: RecipeAdd,
  },
];
