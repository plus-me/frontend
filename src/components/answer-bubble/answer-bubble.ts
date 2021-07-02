import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-answer-bubble',
  templateUrl: 'answer-bubble.html'
})

export class AnswerBubbleComponent {
  @ViewChild('votebar') votebar;
  @ViewChild('turnable') turnable;
  @Input() answer: any;
  @Output() upvote = new EventEmitter<any>();
  @Output() downvote = new EventEmitter<any>();

  constructor() {
  }

  panEvent(e) {
    if (e.isFinal) {
      const acceptDelta = this.votebar.nativeElement.offsetWidth * 0.25;
      if      (e.deltaX >  acceptDelta) { this.upvote.emit(this.answer); }
      else if (e.deltaX < -acceptDelta) { this.downvote.emit(this.answer); }
      else                              { this.turnable.nativeElement.style.transform = ''; }
    } else if (e.distance > 10) {
      this.turnable.nativeElement.style.transform = 'scaleX(' + (1 / (e.distance / 10)) + ')';
    }
  }
}
