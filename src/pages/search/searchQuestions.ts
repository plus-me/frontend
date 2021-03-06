import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';

import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { Observable } from 'rxjs';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { UserStateInterface } from '@plusme/libs/states/user.state';
import { TagModel } from '@plusme/libs/models/tag.model';

@Component({
  selector: 'app-page-search-questions',
  templateUrl: 'searchQuestions.html',
  styleUrls: ['searchQuestions.scss']
})
export class SearchQuestionsPage {
  @Select((store: GlobalState) => store.questions.searchQuestions)
  public questions: Observable<QuestionModel[]>;
  @Select((store: GlobalState) => store.user)
  public user: Observable<UserStateInterface>;
  @Select((store: GlobalState) => store.tags)
  public tags$: Observable<TagModel[]>;
  @Select((state: GlobalState) => state.questions.sorting)
  public sorting: Observable<string>;
  @Select((state: GlobalState) => state.questions.searchPage)
  public page: Observable<number>;
  @Select((state: GlobalState) => state.questions.searchMaximumPages)
  public maximumPages: Observable<number>;

  public searchText = '';

  constructor(
    private loadCtrl: LoadingController,
    private store: Store,
  ) { }

  public async ionViewDidEnter() {
    if (this.store.selectSnapshot((state: GlobalState) => state.user.isLoggedIn) === false) {
      return;
    }
    this.store.dispatch(new UserActions.GetVotes());
  }

  public async search(tag: TagModel) {
    this.store.dispatch(new QuestionActions.GetQuestionsByTagAction(tag));
  }

  async loadNextPage() {
    this.store.dispatch(new QuestionActions.LoadNextSearchPage());
  }

  async loadPreviousPage() {
    this.store.dispatch(new QuestionActions.LoadPreviousSearchPage());
  }

  loadAnswerPage($event) {
    console.log('GOANSWERS-Event:', $event);
  }

  loadSearchPage($event) {
    console.log('GOSEARCH-Event:', $event);
  }
}
