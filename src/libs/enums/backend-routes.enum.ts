export enum BackendRoutes {
  Questions = '/Questions/',
  RandomQuestion = '/Questions/random/',
  MyQuestions = '/Questions/my/',
  UpvoteQuestion = '/Questions/:id/upvote/',
  DownvoteQuestion = '/Questions/:id/downvote/',
  QuestionsByTag = '/Tags/:id/Questions/',
  Answers = '/Answers/:id/',
  AnsweredQuestions = '/Questions/?answered=true&ordering=-closed_date'
}
