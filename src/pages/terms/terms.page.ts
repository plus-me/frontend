import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: 'terms.page.html'
})
export class TermsPage {
  @Input()
  public isModal = false;
}
