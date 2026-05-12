import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedRecipes } from '../models/paginated-recipes';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.backendApi}/favorites`;

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken() || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  toggleFavorite(recipeId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/toggle`,
      { recipeId },
      { headers: this.getHeaders() },
    );
  }

  checkStatus(recipeId: string): Observable<{ isFavorite: boolean }> {
    return this.http.get<{ isFavorite: boolean }>(`${this.apiUrl}/status/${recipeId}`, {
      headers: this.getHeaders(),
    });
  }

  getFavorites(page: number = 1, limit: number = 9): Observable<PaginatedRecipes> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedRecipes>(this.apiUrl, { 
      headers: this.getHeaders(),
      params 
    });
  }
}
