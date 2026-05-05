import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileupdateService {
    private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.backendApi}/user`;

  updateUser(profileData: any): Observable<any> {
    // Hakee Access Token
    const token = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<any>(`${this.apiUrl}/complete-profile`, profileData, { headers });
  }
}
