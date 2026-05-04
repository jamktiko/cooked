import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Uploadservice } from '../uploadservice';
@Component({
  selector: 'app-uploadimg',
  imports: [],
  templateUrl: './uploadimg.html',
  styleUrl: './uploadimg.css',
})
export class Uploadimg {
    private Uploadservice = inject(Uploadservice);

  // Signals tilanhallintaan
  progress = signal(0);
  isUploading = signal(false);
  uploadComplete = signal(false);

onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    
    // Alustetaan tila latausta varten
    this.isUploading.set(true);
    this.uploadComplete.set(false);
    this.progress.set(0);

    console.log('1. Aloitetaan haku tiedostolle:', file.name);

    // 1. Haetaan presigned URL backendistä
    this.Uploadservice.getPresignedUrl(file.name, file.type).subscribe({
      next: (response: any) => {
        console.log('2. Backend vastaus:', response);

        // VARMISTUS: Poimitaan URL, vaikka se olisi suoraan string tai objektin sisällä
        const targetUrl = response.uploadUrl

        if (!targetUrl || typeof targetUrl !== 'string') {
          console.error('VIRHE: URL-osoitetta ei löytynyt vastauksesta!', response);
          this.isUploading.set(false);
          return;
        }

        console.log('3. Käytetään S3-osoitetta:', targetUrl);

        // 2. Lähetetään tiedosto S3-bucketiin
        this.Uploadservice.uploadFile(targetUrl, file).subscribe({
          next: (status: { progress: number; done: boolean }) => {
            this.progress.set(status.progress);
            
            if (status.done) {
              console.log('4. Lataus valmis!');
              this.isUploading.set(false);
              this.uploadComplete.set(true);
            }
          },
          error: (err: any) => {
            console.error('Lataus S3:een epäonnistui:', err);
            this.isUploading.set(false);
          }
        });
      },
      error: (err: any) => {
        console.error('URL-haku backendistä epäonnistui:', err);
        this.isUploading.set(false);
      }
    });
  }
}
