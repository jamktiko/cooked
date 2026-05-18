import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Uploadservice {
  private http = inject(HttpClient);

  getPresignedUrl(fileName: string, fileType: string, folder: string): Observable<{ uploadUrl: string, key: string }> {
    const requesturl = `${environment.backendApi}/aws/get-upload-url`
    return this.http.get<{ uploadUrl: string, key: string }>(requesturl, {
      params: { fileName, fileType, folder }
    });
  }

  uploadProcess(file: File, folder: string): Observable<{ imageUrl: string, key: string }> {
    return this.getPresignedUrl(file.name, file.type, folder).pipe(
      switchMap(response => {
        const uploadUrl = response.uploadUrl;
        const key = response.key;
        const imageUrl = uploadUrl.split('?')[0]; // S3 URL ilman query-parametreja

        // Tehdään simppeli PUT-pyyntö S3-palvelimelle annettuihin otsikoihin luottaen
        return this.uploadFile(uploadUrl, file).pipe(
          map(() => ({ imageUrl, key }))
        );
      })
    );
  }

  uploadFile(url: string, file: File): Observable<any> {
    return this.http.put(url, file, {
      headers: { 'Content-Type': file.type }
    });
  }
}
