import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html'
})
export class ProfilePage {

  constructor(
    private store: Store,
    private notifier: TranslatedNotificationController
  ) {
  }

  logout() {
    this.store.dispatch(UserActions.LogoutAction);
  }

  deleteAccount() {
    this.notifier.showToast('WIP');
  }
}
