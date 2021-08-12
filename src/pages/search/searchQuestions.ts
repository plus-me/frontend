import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { QuestionServiceProvider } from '@plusme/providers/question-service/question-service';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';

import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { Observable } from 'rxjs';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { TagModel } from '@plusme/libs/models/tag.model';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';

@Component({
  selector: 'app-page-search-questions',
  templateUrl: 'searchQuestions.html',
  styleUrls: ['searchQuestions.scss']
})
export class SearchQuestionsPage {
  @Select((store: GlobalState) => store.questions.questions)
  public questions: Observable<QuestionModel[]>;

  public searchText = '';

  constructor(
    private loadCtrl: LoadingController,
    private store: Store,
    private notifier: TranslatedNotificationController,
  ) {
  }

  public async search() {
    if (this.searchText.length < 3) {
      await this.notifier.showToast('SEARCH.NotEnoughSearchCharacters');
      return;
    }
    const loading = await this.loadCtrl.create();
    await loading.present();

    this
      .store
      .dispatch(new QuestionActions.SearchQuestionsAction(this.searchText))
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }

  loadAnswerPage($event) {
    console.log('GOANSWERS-Event:', $event);
  }

  loadSearchPage($event) {
    console.log('GOSEARCH-Event:', $event);
  }
}
