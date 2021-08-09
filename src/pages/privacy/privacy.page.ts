import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: 'privacy.page.html'
})
export class PrivacyPage {
  @Input()
  public isModal = false;
}
