import { Component, signal, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploadimg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploadimg.html',
  styleUrl: './uploadimg.css',
})
export class Uploadimg {
  folder = input.required<string>();
  initialImage = input<string | null>(null);
  fileSelected = output<File>();

  previewUrl = signal<string | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Jos tiedosto ei ole kuva, emitoidaan se suoraan
    if (!file.type.startsWith('image/')) {
      this.fileSelected.emit(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // Määritetään maksimimmitat (1200x1200px riittää loistavasti koko näytölle)
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height *= MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width *= MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Tallennetaan kuva JPEG-muotoon 80% laadulla (~150-300kt tiedostokoko vs alkuperäinen ~5Mt)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Tehdään Blobista normaali File-objekti, jotta muu koodi ei edes huomaa eroa
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });

                // Myös esikatselu ladataan suoraan kompressoidusta tiedostosta
                this.previewUrl.set(URL.createObjectURL(compressedFile));
                
                // Emmitoidaan pienennetty kuva yläkomponenteille tallennettavaksi
                this.fileSelected.emit(compressedFile);
              }
            },
            'image/jpeg',
            0.8
          );
        }
      };
      
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
