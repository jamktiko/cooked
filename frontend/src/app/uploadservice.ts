import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map } from 'rxjs'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class Uploadservice {
    private http = inject(HttpClient);

  getPresignedUrl(fileName: string, fileType: string): Observable<{ url: string }> {
    const requesturl = `${environment.backendApi}aws/get-upload-url`
    console.log(environment.backendApi)
    return this.http.get<{ url: string }>(requesturl, {
      params: { fileName, fileType }
    });
  }

  uploadFile(url: string, file: File): Observable<{ progress: number; done: boolean }> {
    return this.http.put(url, file, {
      reportProgress: true,
      observe: 'events',
      headers: { 'Content-Type': file.type }
    }).pipe(
      // Tyypitetään event tässä kohtaa (HttpEvent<any>)
      map((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return { 
              progress: Math.round((100 * (event.loaded || 0)) / (event.total || 1)), 
              done: false 
            };
          case HttpEventType.Response:
            return { progress: 100, done: true };
          default:
            return { progress: 0, done: false };
        }
      })
    );
  }
}
