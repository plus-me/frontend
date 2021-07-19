import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, IonContent, IonRefresher } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {NewsServiceProvider} from '@plusme/providers/news-service/news-service';

@Component({
  templateUrl: 'news.html',
  selector: 'app-page-news',
  providers: [NewsServiceProvider],
})
export class NewsPage {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  public news: any;
  public connectionErrorToast: HTMLIonToastElement;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public newsService: NewsServiceProvider,
  ) {
    translate.get('CONNERROR', {value: 'world'}).subscribe(async (res: string) => {
      this.connectionErrorToast = await this.toastCtrl.create({
        message: res,
        duration: 3000
      });
    });
  }

  ionViewDidEnter() {
    this.loadNews();
  }

  loadNews() {
    this
      .newsService
      .loadNews()
      .subscribe(
        data => {
          this.refresher.complete();
          this.news = data;
          if (data.length) {this.newsService.updateSeenNews(data.map(d => d.id));}
        },
        () => {
          this.refresher.complete();
          this.connectionErrorToast.present();
        }
      );
  }

}
