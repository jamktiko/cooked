import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.backendApi}/my-recipes`;

  createRecipe(recipeData: Recipe): Observable<Recipe> {
    // 1. Hae Access Token (tämä täsmää backendin tokenUse: 'access' asetukseen)
    const token = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // 2. Varmista, että url on oikein (sisältää /api/ jos se on backendissä)
    return this.http.post<Recipe>(`${this.apiUrl}/create`, recipeData, { headers });
  }
}
