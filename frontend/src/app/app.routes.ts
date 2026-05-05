import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Frontpage } from './frontpage/frontpage';
import { RecipeAdd } from './recipe-add/recipe-add';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { CompleteProfile } from './complete-profile/complete-profile';
import { authGuard } from './auth/auth.guard';
import { MyRecipes } from './my-recipes/my-recipes';
import { MyRecipeDetail } from './my-recipe-detail/my-recipe-detail';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: LoginComponent },
  { path: 'frontpage', component: Frontpage },
  { path: '', redirectTo: '/frontpage', pathMatch: 'full' },
  { path: 'recipe/:id', component: RecipeDetail },
  {
    path: 'new-recipe',
    component: RecipeAdd,
    canActivate: [authGuard],
  },
  {
    path: 'my-recipes',
    component: MyRecipes,
    canActivate: [authGuard],
  },
  { path: 'my-recipe/:id', component: MyRecipeDetail, canActivate: [authGuard] },
  { path: 'complete-profile', component: CompleteProfile },
];
