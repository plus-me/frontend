import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';


/**
 * Authentication guard which checks if user is logged in
 */
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    /**
     * creates a new instance of AuthGuard
     */
    public constructor(
      private router: Router,
      private store: Store,
    ) { }

    /**
     * check if user is logged in
     * Is handled in angular routing, route is given but never used
     */
    public async canActivate(route: ActivatedRouteSnapshot) {
        let canActivate: boolean;

        if (route instanceof ActivatedRouteSnapshot) {
          const isLoggedIn = this.store.selectSnapshot((store: GlobalState) => store.user.isLoggedIn);
            if (isLoggedIn) {
                canActivate = true;
            } else {
                await this.router.navigate([
                  FrontendRoutes.Tabs,
                  FrontendRoutes.Welcome,
                ]);
                canActivate = false;
            }
        } else {
            canActivate = false;
        }
        return canActivate;
    }
}
