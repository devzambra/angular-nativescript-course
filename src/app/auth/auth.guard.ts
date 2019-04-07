import { RouterExtensions } from 'nativescript-angular/router';
import { AuthService } from './auth.service';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanLoad {
    constructor(private auth: AuthService, private router: RouterExtensions) {}

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.user.pipe(
            take(1),
            switchMap(currentUser => {
                if(!currentUser || !currentUser.token) {
                    return this.auth.autoLogin();
                }
                return of(true);
            }),
            tap( isAuth => {
                if(!isAuth) {
                    this.router.navigate(['/auth']);
                }
            }));
    }
}
