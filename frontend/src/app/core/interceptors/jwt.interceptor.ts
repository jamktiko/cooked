import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // interceptorit nappaavat http pyynnön, muokkaavat sitä halutulla tavalla ja lopuksi palauttavat vastauksen

  // tässä katsotaan onko http pyynnön osoite backendimme osoite
  if (!req.url.startsWith(environment.backendApi)) {
    return next(req);
  }

  // getAccessToken() palauttaa Observablen, joten käytetään rxjs:n switchMapia
  return authService.getAccessToken().pipe(
    // switchmap ketjuttaa asynkroniset operaatiot
    // ja vaihtaa ensimmäisen observablen tuloksen seuraavaan lennosta
    // tässä switchmap nappaa tokenin heti kun se tulee observablesta
    switchMap((token) => {
      // jos tokeni on saapunut tehdään muutokset http pyyntöön
      // tässä tapauksessa lisätään headeriin auth token
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // palautetaan seuraava observable joka on originaali http pyyntö
      return next(req);
    })
  );
};