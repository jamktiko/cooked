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
  fileSelected = output<File>();

  previewUrl = signal<string | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Luodaan esikatselu
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Emitoidaan tiedosto yläkomponentille
    this.fileSelected.emit(file);
  }
}
