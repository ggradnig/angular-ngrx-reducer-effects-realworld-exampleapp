import {createAction, props} from '@ngrx/store';
import {Article, Comment, User} from '../core';

export const Actions = {
  routeDataChanged: createAction('[Action] Route data changed', props<{ article: Article }>()),
  currentUserChanged: createAction('[Action] Current user changed', props<{ user: User }>()),

  articleLoaded: createAction('[Action] Article loaded', props<{ article: Article }>()),
  loadArticleFailed: createAction('[Action] Load article failed', props<{ error: any }>()),

  commentsLoaded: createAction('[Action] Comments loaded', props<{ comments: Comment[] }>()),

  toggleFavorite: createAction('[Action] Toggle favorite', props<{ favorited: boolean }>()),
  toggleFollowing: createAction('[Action] Toggle following', props<{ following: boolean }>()),

  deleteArticle: createAction('[Action] Delete article'),
  articleDeleted: createAction('[Action] Article deleted'),

  addComment: createAction('[Action] Add comment'),
  commentAdded: createAction('[Action] Comment added', props<{comment: Comment}>()),
  addCommentFailed: createAction('[Action] Add comment failed', props<{errors: any}>()),

  deleteComment: createAction('[Action] Delete comment', props<{commentId: number}>()),
  commentDeleted: createAction('[Action] Comment deleted')
};
