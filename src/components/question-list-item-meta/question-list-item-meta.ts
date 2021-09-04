import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { QuestionModel } from '@plusme/libs/models/question.model';


@Component({
  selector: 'app-question-list-item-meta',
  templateUrl: 'question-list-item-meta.html',
  styleUrls: ['./question-list-item-meta.scss'],
})
export class QuestionListItemMetaComponent {
  @Input() question: QuestionModel;
  @Input() hideRelation = true;

  public constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  public gotoAnswers(question: QuestionModel) {
    this.hideModal();
    this.store.dispatch(new Navigate([FrontendRoutes.Answers, { id: question.id }]));
  }

  private async hideModal() {
    const overlay = await this.modalController.getTop();

    if (typeof overlay !== 'undefined') {
      await overlay.dismiss();
    }
  }
}
