import { Component, Input } from '@angular/core';
import {Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {FrontendRoutes} from '@plusme/libs/enums/frontend-routes.enum';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  @Input()
  public title = '';

  @Input()
  public onlyBack = false;

  @Input()
  public isModal = false;

  constructor(
    private store: Store,
    private location: Location,
    private modalController: ModalController,
  ) {}

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

  goBack() {
    this.location.back();
  }

  public dismissModal() {
    this.modalController.dismiss();
  }
}
