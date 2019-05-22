import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
// vu que nous devons injecter un autre service, il faut utiliser l'annotation
// @injectable()
export class AuthGuardService implements CanActivate {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

    constructor(private authService: AuthService, private router: Router) {

    }

    // La logique d'authentification se definie toujours dans la methode canActivate
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
        // On definie la logique d'authentification ici
        // par exemple, verifie en bdd si user existe et renvoyer un booleen
        if (this.authService.isAuth) {
            return true;
        } else {
            // si user n'est pas authentifie, on redirige vers la page d'authentification
            this.router.navigate(['/auth/signin']);
        }
    }
}
