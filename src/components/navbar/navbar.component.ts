import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {Actions, ofActionSuccessful, Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {FrontendRoutes} from '@plusme/libs/enums/frontend-routes.enum';
import { IonSearchbar, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SearchQuestionsPage } from '@plusme/pages/search/searchQuestions';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { SortMenuComponent } from '@plusme/components/navbar/sort.component';


@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent implements AfterViewInit {
  @Input()
  public title = '';

  @Input()
  public onlyBack = false;

  @Input()
  public isModal = false;

  @Input()
  public hasSearch = false;

  @ViewChild(IonSearchbar)
  private searchBar?: IonSearchbar;

  constructor(
    private store: Store,
    private location: Location,
    private modalController: ModalController,
    private loadController: LoadingController,
    private popoverController: PopoverController,
    private actions: Actions,
  ) { }

  public ngAfterViewInit() {
    if (this.searchBar instanceof IonSearchbar) {
      setTimeout(() => this.searchBar.setFocus(), 200);
    }

    this
      .actions
      .pipe(
        ofActionSuccessful(QuestionActions.GetQuestionsByTagAction)
      )
      .subscribe((action: QuestionActions.GetQuestionsByTagAction ) => {
        if (this.searchBar instanceof IonSearchbar) {
          this.searchBar.value = action.tag.text;
        }
      });
  }

  gotoInbox() {
    this.store.dispatch(new QuestionActions.ResetSearchQuestionsAction());
    this.store.dispatch(new QuestionActions.ResetMyQuestionsAction());
    this.store.dispatch(new Navigate([
      FrontendRoutes.Inbox,
    ]));
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SortMenuComponent,
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then(sortBy => {
      if (sortBy.data === undefined) {
        return;
      }
      this.store.dispatch(new QuestionActions.SetSorting(sortBy.data));
    });

    await popover.present();
  }

  public async search(event: Event) {
    const searchText = (event.target as any).value;
    const loading = await this.loadController.create();
    await loading.present();

    this.store.dispatch(new QuestionActions.SetSearchText(searchText));

    this
      .store
      .dispatch(new QuestionActions.SearchQuestionsAction())
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }

  public async gotoSearch() {
    if (this.isModal === true) {
      return;
    }

    this.store.dispatch(new QuestionActions.ResetSearchQuestionsAction());

    const searchModal = await this.modalController.create({
      component: SearchQuestionsPage,
      animated: false,
    });
    await searchModal.present();
  }

  goBack() {
    this.location.back();
  }

  public dismissModal() {
    this.modalController.dismiss();
  }
}
