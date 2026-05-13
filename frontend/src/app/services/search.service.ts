import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';

// Luodaan TypeScript-rajapinta backendin palauttamalle datamuodolle
export interface SearchResponse {
  recipes: Recipe[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = environment.backendApi;

  /**
   * Public search: Searches public recipes from all users
   */
  searchPublicRecipes(term: string, page: number = 1, limit: number = 10): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', term)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<SearchResponse>(`${this.apiUrl}/recipes/search`, { params });
  }

  /**
   * Private search: Searches only the logged-in user's recipes
   * (JWT interceptor handles adding the token automatically)
   */
  searchPrivateRecipes(term: string, page: number = 1, limit: number = 10): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', term)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<SearchResponse>(`${this.apiUrl}/my-recipes/search`, { params });
  }
}