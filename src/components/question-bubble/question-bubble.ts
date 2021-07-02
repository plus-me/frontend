import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TagsHelper } from '../../utils/TagsHelper';

/*eslint no-underscore-dangle: [0]*/

@Component({
  selector: 'app-question-bubble',
  templateUrl: 'question-bubble.html'
})

export class QuestionBubbleComponent {
  @ViewChild('questionbubble') questionBubble;
  @ViewChild('lasche') lasche;
  @ViewChild('votebar') votebar;
  @ViewChild('community') community;
  @Input() question: any;
  @Input() enableDownvote = true;
  @Input() enableUpvote = true;
  @Output() textClick = new EventEmitter<any>();
  @Output() tagClick = new EventEmitter<any>();
  @Output() upvote = new EventEmitter<any>();
  @Output() downvote = new EventEmitter<any>();
  @Output() voting = new EventEmitter<boolean>();

  private _panState = 'idle';

  constructor(public tagsHelper: TagsHelper) {
  }

  loadTags(question) {
    return this.tagsHelper.getTagObjects(question.tags);
  }

  resetPan() {
    this.community.nativeElement.style.left = '';
    this.lasche.nativeElement.style.left = '';
    this.questionBubble.nativeElement.style.backgroundColor = '';
    this.questionBubble.nativeElement.style.transform = '';
    this.lasche.nativeElement.style.fill = '';
  }

  downvoteQuestion() {
    if (this.enableDownvote && this.question.voted === null) {
      this.downvote.emit(this.question);
      this.question.voted = false;
    }
  }

  upvoteQuestion() {
    if (this.enableUpvote && !this.question.voted) {
      this.upvote.emit(this.question);
      this.question.voted = true;
      this.question.upvotes += 1;
    }
  }

  panEvent(e) {
    if (!this.enableDownvote && !this.enableUpvote) {return;}
    const currentState = this._panState;
    if (e.isFinal) {
      this._panState = 'idle';
      this.voting.emit(false);
    }
    if (this.question.voted || currentState === 'disabled') {return;}
    const minLeft = 50;
    const acceptDelta = this.votebar.nativeElement.offsetWidth * 0.3;
    const upvoted = e.deltaX > acceptDelta && currentState === 'panright';
    const downvoted = e.deltaX < -acceptDelta && currentState === 'panleft';
    if (upvoted) {
      console.log('upvote');
      this._panState = 'disabled';
      this.upvoteQuestion();
    }
    if (downvoted) {
      console.log('downvote');
      this._panState = 'disabled';
      this.downvoteQuestion();
    }
    if (e.isFinal || upvoted || downvoted) {
      this.resetPan();
      return;
    }

    if (currentState === 'idle') {
      if (e.additionalEvent === 'panright') {
        this._panState = e.additionalEvent;
        this.voting.emit(true);
      } else if (e.additionalEvent === 'panleft' && this.enableDownvote) {
        this._panState = e.additionalEvent;
        this.voting.emit(true);
      } else {this._panState = 'disabled';}
    }
    if (this._panState === 'panright') {
      let x = Math.max(minLeft, Math.min(this.votebar.nativeElement.offsetWidth - 10, e.center.x));
      this.lasche.nativeElement.style.left = (x - minLeft) + 'px';
      this.community.nativeElement.style.left = (x - minLeft) + 'px';
      x = x / e.srcEvent.view.innerWidth;
      const s = Math.round(82.9 * x);
      const l = Math.round(88.2 - (88.2 - 48.2) * x);
      const c = 'hsl(165,' + s + '%,' + l + '%)';
      this.questionBubble.nativeElement.style.backgroundColor = c;
      this.lasche.nativeElement.style.fill = c;
    }
    if (this._panState === 'panleft') {
      this.questionBubble.nativeElement.style.transform = 'translateX(' + e.deltaX + 'px)';
    }
  }
}
