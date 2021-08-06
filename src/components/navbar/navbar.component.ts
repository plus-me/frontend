import { Component, Input } from '@angular/core';
import {Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {FrontendRoutes} from '@plusme/libs/enums/frontend-routes.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  @Input()
  public title = '';

  constructor(
    private store: Store,
  ) {
  }

  gotoInbox() {
    this.store.dispatch(new Navigate([
      FrontendRoutes.Inbox,
    ]));
  }

  gotoSearch() {
    this.store.dispatch(new Navigate([
      FrontendRoutes.SearchQuestions,
    ]));
  }
}
