import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class ProfileupdateService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.backendApi}/user`;

  updateUser(profileData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/complete-profile`, profileData);
  }
  getUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/me`);
  }
}
