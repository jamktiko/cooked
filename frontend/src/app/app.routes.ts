import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Frontpage } from './frontpage/frontpage';
import { RecipeAdd } from './recipe-add/recipe-add';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { CompleteProfile } from './complete-profile/complete-profile';
import { authGuard } from './auth/auth.guard';
import { MyRecipes } from './my-recipes/my-recipes';
import { MyRecipeDetail } from './my-recipe-detail/my-recipe-detail';
import { RecipeEdit } from './recipe-edit/recipe-edit';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: LoginComponent },
  { path: 'frontpage', component: Frontpage },
  { path: 'complete-profile', component: CompleteProfile },
  { path: 'recipe/:id', component: RecipeDetail },

  // Suojatut reitit (Vaativat kirjautumisen)
  {
    path: 'my-recipes',
    component: MyRecipes,
    canActivate: [authGuard],
  },
  {
    path: 'my-recipe/:id',
    component: MyRecipeDetail,
    canActivate: [authGuard],
  },
  {
    path: 'new-recipe',
    component: RecipeAdd,
    canActivate: [authGuard],
  },
  { path: 'edit-recipe/:id', component: RecipeEdit, canActivate: [authGuard] },

  // Uudelleenohjaukset ja virhetilanteet
  { path: '', redirectTo: '/frontpage', pathMatch: 'full' },
  { path: '**', redirectTo: '/frontpage' },
];
