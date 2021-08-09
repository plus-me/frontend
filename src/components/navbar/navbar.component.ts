import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  @Input()
  public title = '';

  @Input()
  public isModal = false;

  public constructor(
    private modalControler: ModalController,
  ) { }

  public dismissModal() {
    this.modalControler.dismiss();
  }
}
