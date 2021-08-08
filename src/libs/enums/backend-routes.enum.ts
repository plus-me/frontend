export enum BackendRoutes {
  Questions = '/Questions/',
  RandomQuestion = '/Questions/random/',
  MyQuestions = '/Questions/my/',
  UpvoteQuestion = '/Questions/:id/upvote/',
  DownvoteQuestion = '/Questions/:id/downvote/',
  Answers = '/Answers/:id',
  AnsweredQuestions = '/Questions/?answered=true&ordering=-closed_date'
}
