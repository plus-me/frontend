import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { UnknownHttpError } from '@plusme/libs/errors/unknown-http.error';
import { ValidationError } from '@plusme/libs/errors/validation.error';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { TagModel } from '@plusme/libs/models/tag.model';
import { Observable } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
})
export class CreateQuestionComponent {
  @Select((state: GlobalState) => state.tags)
  public tags$: Observable<TagModel[]>;

  public authForm: FormGroup;
  public question: AbstractControl;
  public tags: AbstractControl;

  public lengthColor = 'green';

  public constructor(
    private modalControler: ModalController,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
    private store: Store,
    private toaster: ToastController,
    private translator: TranslateService,
  ) {
    this.authForm = this.formBuilder.group({
      question: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(280),
      ])],
      tags: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3),
      ])]
    });

    this.question = this.authForm.controls.question;
    this.tags = this.authForm.controls.tags;
  }

  public textChange(event: Event) {
    const textarea = (event as CustomEvent<InputEvent>).detail.target as HTMLTextAreaElement;
    if (textarea.value.length > 280) {
      this.lengthColor = 'red';
    } else if (textarea.value.length > 200) {
      this.lengthColor = 'yellow';
    } else {
      this.lengthColor = 'green';
    }
  }

  public goToCodex() {
    this.store.dispatch(new Navigate([FrontendRoutes.Terms]));
    this.modalControler.dismiss();
  }

  public dismissModal() {
    this.modalControler.dismiss();
  }

  public async submit() {
    if (!this.authForm.valid) {
      return;
    }

    const loading = await this.loading.create();

    await loading.present();

    const action = new QuestionActions.CreateQuestionAction(
      this.authForm.controls.question.value,
      this.authForm.controls.tags.value,
    );

    this
      .store
      .dispatch(action)
      .subscribe(
        async () => {
          await loading.dismiss();

          await this.modalControler.dismiss();

          const toast = await this.toaster.create({
            message: this.translator.instant('createQuestion.success'),
            color: 'success',
            position: 'top',
            duration: 2000,
          });

          await toast.present();
        },
        async (error: unknown) => {
          await loading.dismiss();

          if (error instanceof ValidationError) {
            await this.createErrorToast(`createQuestion.errors.${Object.keys(error.reasons)[0]}`);
          } else if(error instanceof UnknownHttpError) {
            await this.createErrorToast('createQuestion.errors.unknownHttpError');
          } else {
            await this.createErrorToast('createQuestion.errors.unknownError');
          }
        }
      );
  }

  private async createErrorToast(message: string) {
            const toast = await this.toaster.create({
              message: this.translator.instant(
                message,
              ),
              duration: 4000,
              color: 'danger',
              position: 'top',
            });

            await toast.present();
  }
}
