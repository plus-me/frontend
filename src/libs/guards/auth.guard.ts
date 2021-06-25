import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';
import { NavController } from '@ionic/angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';


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
      private userService: UserServiceProvider,
      private navCtrl: NavController,
    ) { }

    /**
     * check if user is logged in
     * Is handled in angular routing, route is given but never used
     */
    public async canActivate(route: ActivatedRouteSnapshot) {
        let canActivate: boolean;

        if (route instanceof ActivatedRouteSnapshot) {
          const token = await this.userService.getToken();
            if (typeof token === 'string') {
                canActivate = true;
            } else {
                await this.navCtrl.navigateRoot(FrontendRoutes.Welcome);
                canActivate = false;
            }
        } else {
            canActivate = false;
        }
        return canActivate;
    }
}
