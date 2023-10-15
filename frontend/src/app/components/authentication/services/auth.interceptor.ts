import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private userType: UserService,
  ) { }

  data: any;

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.data = error;
        if (this.data.status == 403) {
          if (this.userType.getUser() instanceof User) {
            return this.authService.refreshTokenUser().pipe(
              catchError(() => {
                // se la richiesta di refresh token fallisce, reindirizza l'utente alla pagina di login
                // rimuove i token dalla memoria locale
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return throwError(error);
              }),
              // se la richiesta di refresh token ha successo, aggiorna i token nella memoria locale e ripete la richiesta originale con il nuovo token di accesso
              // l'uso di "switchMap" consente di ripetere la richiesta originale con la nuova autorizzazione
              switchMap((tokens: any) => {
                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);
                console.log("Token aggiornati.\nNuovo Access Token :" + tokens.accessToken + "\nNuovo Refresh Token :" + tokens.refreshToken);
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${tokens.accessToken}`
                  }
                });
                return next.handle(req);
              })
            );
          }
        }
        return throwError(error);
      })
    );
  }

}
