// services/favorite.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.backendApi}/favorites`;

  // Apumetodi headereiden luontiin, jotta koodia ei tarvitse toistaa
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

  getFavorites(): Observable<any[]> {
    // TÄRKEÄÄ: Lisätty headers myös tähän
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
