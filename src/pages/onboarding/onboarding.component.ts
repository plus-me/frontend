import { Component } from "@angular/core";
import { Store } from "@ngxs/store";
import { UserActions } from "src/libs/actions/users.actions";

@Component({
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {
  public constructor(
    private store: Store,
  ) {}

  public finish() {
    this.store.dispatch(new UserActions.FinishedOnboarding());
  }
}
