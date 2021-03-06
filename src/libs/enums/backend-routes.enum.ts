export enum BackendRoutes {
  Questions = '/Questions/',
  Question = '/Questions/:id/',
  RandomQuestion = '/Questions/random/',
  MyQuestions = '/Questions/my/',
  UpvoteQuestion = '/Questions/:id/upvote/',
  DownvoteQuestion = '/Questions/:id/downvote/',
  DownvotedQuestions = '/Questions/downvotes/',
  QuestionsByTag = '/Tags/:id/Questions/',
  AnsweredQuestions = '/Questions/?answered=true&ordering=-closed_date',
  Answers = '/Answers/question/:id/',
  UpVoteAnswer = '/Answers/:id/upvote/',
  DownVoteAnswer = '/Answers/:id/downvote/',
  MyVotes = '/Questions/myvotes/',
  ReportQuestion = '/Questions/:id/report/',
  Devices = '/Devices/',
}
