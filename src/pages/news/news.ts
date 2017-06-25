import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {QuestionServiceProvider} from "../../providers/question-service/question-service";
import {TagsHelper} from "../../utils/TagsHelper";
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: 'news.html',
  selector: 'page-likedQuestions',
  providers: [QuestionServiceProvider],
})
export class NewsPage {

  public questions: any;
  messageConnectionError;

  constructor(public navCtrl: NavController, public questionService: QuestionServiceProvider, public storage: Storage,
              public toastCtrl: ToastController, public translate: TranslateService, public tagsHelper: TagsHelper) {
    translate.get('CONNERROR', {value: 'world'}).subscribe((res: string) => {
      this.messageConnectionError = res;
    });
    this.loadQuestions();
  }

  ionViewWillEnter() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.storage.get('localUserToken').then((val) => {
      this.questionService.loadLikedQuestions(val).subscribe((data) => {
        if (data !== undefined && data !== []) {
          this.questions = data.map((question) => {
            return question;
          });
        }
        else{
          let toast = this.toastCtrl.create({
            message: this.messageConnectionError,
            duration: 3000
          });
          toast.present();
        }
      });
    });
  }

  loadTags(question) {
    return this.tagsHelper.getTagObjects(question.tags);
  }

}