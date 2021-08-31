import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { Observable } from 'rxjs';
import { UserActions } from '@plusme/libs/actions/users.actions';

@Component({
  selector: 'app-sort-menu',
  templateUrl: './sort.component.html',
})
export class SortMenuComponent {
  @Select((state: GlobalState) => state.user.sorting)
  public sorting: Observable<string>;

  public modes = ['newest', 'upvotes', 'following', 'answers'];

  constructor(
    private popoverController: PopoverController,
    private translate: TranslateService,
    private store: Store
  ) { }

  closePopOver(sortBy) {
    this.store.dispatch(new UserActions.SetSorting(sortBy));
    this.popoverController.dismiss(sortBy);
  }
}
