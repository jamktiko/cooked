import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map, switchMap, filter } from 'rxjs'
import { environment } from '../../environments/environment'

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

        return this.uploadFile(uploadUrl, file).pipe(
          // Odotetaan että lataus on valmis (done: true)
          filter(status => status.done),
          map(() => ({ imageUrl, key }))
        );
      })
    );
  }

  uploadFile(url: string, file: File): Observable<{ progress: number; done: boolean }> {
    return this.http.put(url, file, {
      reportProgress: true,
      observe: 'events',
      headers: { 'Content-Type': file.type }
    }).pipe(
      // Type the event here (HttpEvent<any>)
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
