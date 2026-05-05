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

  private publicUrl = `${environment.backendApi}/recipes`;
  private apiUrl = `${environment.backendApi}/my-recipes`;

  // Hakee kaikki julkiset reseptit
  getPublicRecipes(): Observable<Recipe[]> {
    // Julkiseen hakuun ei yleensä tarvita Authorization-headeria
    return this.http.get<Recipe[]>(`${this.publicUrl}/all`);
  }
  getRecipeById(id: string): Observable<Recipe> {
    // Huom: Tämä hakee julkisesta polusta.
    // Jos backendissä on eri reitti, tarkista se (esim. `${this.publicUrl}/${id}`)
    return this.http.get<Recipe>(`${this.publicUrl}/${id}`);
  }
  // Luo uuden reseptin, vaatii autentikoinnin
  createRecipe(recipeData: Recipe): Observable<Recipe> {
    // Hakee Access Token
    const token = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Recipe>(`${this.apiUrl}/create`, recipeData, { headers });
  }
}
