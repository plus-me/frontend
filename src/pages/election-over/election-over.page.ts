import { Component } from '@angular/core';

@Component({
  selector: 'app-election-over',
  templateUrl: 'election-over.page.html',
})
export class ElectionOverPage {
  public slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor() {
  }

}
