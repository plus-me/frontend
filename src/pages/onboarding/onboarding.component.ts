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
  public constructor(
    private store: Store,
  ) {}

  public finish() {
    this.store.dispatch(new UserActions.FinishedOnboarding());
  }

  public skipOnboarding() {
    if(this.activeSlide !== 4)
      this.store.dispatch(new UserActions.FinishedOnboarding());
  }

  public slideChanged() {
    this.slides.lockSwipeToPrev(true);
    this.slides.getActiveIndex().then(index => {
      this.activeSlide = index;
    });
  }
}
