// services/favorite.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/favorites';

  toggleFavorite(recipeId: string) {
    // Jos et käytä Interceptoria, sinun täytyy lisätä headerit käsin:
    const token = this.authService.getAccessToken() || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/toggle`, { recipeId }, { headers });
  }

  checkStatus(recipeId: string) {
    const token = this.authService.getAccessToken() || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{ isFavorite: boolean }>(`${this.apiUrl}/status/${recipeId}`, { headers });
  }
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
