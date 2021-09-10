import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { Observable } from 'rxjs';
import { QuestionActions } from '@plusme/libs/actions/questions.action';

@Component({
  selector: 'app-sort-menu',
  templateUrl: './sort.component.html',
})
export class SortMenuComponent {
  @Select((state: GlobalState) => state.questions.sorting)
  public sorting: Observable<string>;

  public modes = ['newest', 'upvotes'];

  constructor(
    private popoverController: PopoverController,
  ) { }

  closePopOver(sortBy) {
    this.popoverController.dismiss(sortBy);
  }
}
