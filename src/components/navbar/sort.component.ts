import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sort-menu',
  templateUrl: './sort.component.html',
})
export class SortMenuComponent {

  constructor(
    private popoverController: PopoverController,
    private translate: TranslateService,
  ) { }

  closePopOver(sortBy) {
    this.popoverController.dismiss(sortBy);
  }
}
