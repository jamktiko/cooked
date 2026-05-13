import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // interceptorit nappaavat http pyynnön, muokkaavat sitä halutulla tavalla ja lopuksi palauttavat vastauksen

  // check if the http request address is our backend address
  if (!req.url.startsWith(environment.backendApi)) {
    return next(req);
  }

  // getAccessToken() palauttaa Observablen, joten käytetään rxjs:n switchMapia
  return authService.getAccessToken().pipe(
    // switchmap ketjuttaa asynkroniset operaatiot
    // ja vaihtaa ensimmäisen observablen tuloksen seuraavaan lennosta
    // here switchMap grabs the token as soon as it arrives from the observable
    switchMap((token) => {
      // jos tokeni on saapunut tehdään muutokset http pyyntöön
      // in this case add the auth token to the header
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