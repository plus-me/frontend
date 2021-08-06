import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserActions } from 'src/libs/actions/users.actions';
import { IonSlides } from '@ionic/angular';

@Component({
  templateUrl: './onboarding.component.html',
  styleUrls: ['onboarding.component.scss']
})
export class OnboardingComponent {
  @ViewChild(IonSlides) slides: IonSlides;
  activeSlide = 0;

  sliderOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  };
  public constructor(
    private store: Store,
  ) {}


  public async ionViewDidEnter() {
    this.slides.getSwiper().then(swiper => {
      swiper.pagination.destroy();
    });
  }

  public finish() {
    this.store.dispatch(new UserActions.FinishedOnboarding());
  }

  public skipOnboarding() {
      this.store.dispatch(new UserActions.FinishedOnboarding());
  }

  public nextSlide() {
    this.slides.slideNext();
  }

  public slideChanged() {
    this.slides.getActiveIndex().then(index => {
      this.activeSlide = index;

      this.slides.getSwiper().then(swiper => {
        if (index === 0) {
          swiper.pagination.destroy();
        } else {
          swiper.pagination.init();
        }
      });
    });
  }
}
