import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 's3Url',
  standalone: true,
})
export class S3UrlPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value || value === '') {
      return 'taustakuva_cooked.png';
    }
    const baseUrl = environment.s3BaseUrl;
    if (!baseUrl) {
      return `https://error-missing-base-url.com/${value}`;
    }

    return `${baseUrl}/${value}`;
  }
}
