export enum BackendRoutes {
  Questions = '/Questions/',
  Question = '/Questions/:id/',
  RandomQuestion = '/Questions/random/',
  MyQuestions = '/Questions/my/',
  UpvoteQuestion = '/Questions/:id/upvote/',
  DownvoteQuestion = '/Questions/:id/downvote/',
  AnsweredQuestions = '/Questions/?answered=true&ordering=-closed_date',
  Answers = '/Answers/question/:id/',
  UpVoteAnswer = '/Answers/:id/upvote/',
  DownVoteAnswer = '/Answers/:id/downvote/',
}
