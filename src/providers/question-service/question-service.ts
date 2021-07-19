import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {
  Observable,
  zip,
  from,
} from 'rxjs';
import {API_ENDPOINT} from '@plusme/app/app.config';

/*
 * Question service provider
 */
@Injectable()
export class QuestionServiceProvider {

  constructor(
    public http: HttpClient,
    public storage: Storage,
  ) {}

  public loadAllQuestions(params: string) {
    return this.http.get(API_ENDPOINT + '/Questions/' + params);
  }

  public unseenAnsweredQuestions() {
    return this.loadAnsweredQuestions();
  }

  public updateSeenAnsweredQuestions(ids: number[]) {
    this.storage.set('seenAnsweredQuestions', ids);
  }

  public loadAnsweredQuestions() {
    return this.http.get<Array<{ count: number; next: null; previous: null; result: unknown[]}>>(
      API_ENDPOINT + '/Questions/?answered=true&ordering=-closed_date',
    );
  }

  loadOpenQuestions() {
    return this.http.get<any[]>(API_ENDPOINT + '/Questions/upvotes/?answered=false');
  }

  loadRandomQuestion() {
    return this.http.get<any>(API_ENDPOINT + '/Questions/random/');
  }

  loadQuestionByTagId(tagId: number) {
    return this.http.get(API_ENDPOINT + '/Tags/' + tagId + '/Questions/');
  }

  publishQuestion(nText: string, nTags: string) {
    return this
      .http
      .post(
      API_ENDPOINT + '/Questions/',
      {
        text: nText,
        tags: nTags
      },
    );
  }

  reportQuestion(questionID: number) {
    return this
      .http
      .post(
        API_ENDPOINT + '/Questions/' + questionID + '/report/',
        { reason: 'unbekannt' },
      );

  }

  downvoteQuestion(questionID: number) {
    return this.http.post(API_ENDPOINT + '/Questions/' + questionID + '/downvote/', { });
  }

  upvoteQuestion(questionID: number) {
    return this.http.post(API_ENDPOINT + '/Questions/' + questionID + '/upvote/', { });
  }

  getAnswersForQuestion(questionID: number) {
    return this.http.get(API_ENDPOINT + '/Questions/' + questionID + '/answers/');
  }

  downvoteAnswer(answerID: number) {
    return this.http.post(API_ENDPOINT + '/Answers/' + answerID + '/downvote/', { });
  }

  upvoteAnswer(answerID: number) {
    return this.http.post(API_ENDPOINT + '/Answers/' + answerID + '/upvote/', { });
  }

}
