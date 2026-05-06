import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 's3Url',
  standalone: true,
})
export class S3UrlPipe implements PipeTransform {
  transform(value: string | undefined): string {
    // TESTI 1: Jos näet tämän konsolissa, Pipe on kytketty oikein!
    console.log('--- PIPE DEBUG ---');
    console.log('Alkuperäinen arvo:', value);

    if (!value || value === '') {
      return 'taustakuva_cooked.png';
    }

    // TESTI 2: Jos baseUrl on undefined, se on syy localhost-virheeseen
    const baseUrl = environment.s3BaseUrl;
    console.log('Käytetty baseUrl:', baseUrl);

    if (!baseUrl) {
      return `https://error-missing-base-url.com/${value}`;
    }

    return `${baseUrl}/${value}`;
  }
}
