import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {FrontendRoutes} from '@plusme/libs/enums/frontend-routes.enum';
import { IonSearchbar, LoadingController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SearchQuestionsPage } from '@plusme/pages/search/searchQuestions';
import { QuestionActions } from '@plusme/libs/actions/questions.action';

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
  ) { }

  public ngAfterViewInit() {
    if (this.searchBar instanceof IonSearchbar) {
      setTimeout(() => this.searchBar.setFocus(), 200);
    }
  }

  gotoInbox() {
    this.store.dispatch(new Navigate([
      FrontendRoutes.Inbox,
    ]));
  }

  public async search(event: Event) {
    const searchText = (event.target as any).value;
    console.dir(searchText);

    if (searchText.length < 3) {
      return;
    }
    const loading = await this.loadController.create();
    await loading.present();

    this
      .store
      .dispatch(new QuestionActions.SearchQuestionsAction(searchText))
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
