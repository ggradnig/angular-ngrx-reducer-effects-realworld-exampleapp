import { ActionsOf, createReducerEffect, StateWithEffects, withEffects } from 'ngrx-reducer-effects';
import { Actions } from './actions';
import { initialState, Model, State } from './state';
import { ArticlesService, CommentsService } from '../core';
import { FormControl } from '@angular/forms';
import * as _ from 'deepmerge';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';

const Effects = {
  loadArticle: createReducerEffect<Model, { slug: string }>((state, action) => ({
    type: '[Article] Load article',
    operation: (inject) => inject(ArticlesService).get(action.slug),
    next: (article) => Actions.articleLoaded({ article }),
    error: (error) => Actions.loadArticleFailed({ error })
  })),
  loadComments: createReducerEffect<Model>((state) => ({
    type: '[Article] Load comments',
    operation: (inject) => inject(ArticlesService).get(state.article?.slug),
    next: (comments) => Actions.commentsLoaded({ comments })
  })),
  deleteArticle: createReducerEffect<Model>((state) => ({
    type: '[Article] Delete article',
    operation: (inject) => inject(ArticlesService).destroy(state.article?.slug),
    next: () => Actions.articleDeleted()
  })),
  addComment: createReducerEffect<Model>((state) => ({
    type: '[Article] Add comment',
    operation: (inject) => inject(CommentsService).add(state.article?.slug, state.commentControl.value),
    next: (comment) => Actions.commentAdded({ comment }),
    error: (error) => Actions.addCommentFailed({ errors: error })
  })),
  deleteComment: createReducerEffect<Model, { commentId: number }>((state, action) => ({
    type: '[Article] Delete comment',
    operation: (inject) => inject(CommentsService).destroy(state.article?.slug, action.commentId),
    next: () => Actions.articleDeleted()
  }))
};

export function reducer(
  state: State = initialState,
  action: ActionsOf<typeof Actions> | RouterNavigatedAction
): StateWithEffects<State> {
  switch (action.type) {
    case ROUTER_NAVIGATED:
      return withEffects(
        state,
        Effects.loadArticle({ slug: action.payload.routerState.root.firstChild.firstChild.params.slug })
      );
    case Actions.articleLoaded.type:
      return _(state, { article: action.article });
    case Actions.loadArticleFailed.type:
      // todo: redirect to /
      return state;
    case Actions.currentUserChanged.type:
      return _(state, {
        user: action.user,
        canModify: state.article?.author.username === action.user.username,
        isDeleting: false,
        isSubmitting: false
      });
    case Actions.commentsLoaded.type:
      return _(state, { comments: action.comments });
    case Actions.toggleFavorite.type:
      return _(state, {
        article: {
          favoritesCount: action.favorited ? state.article?.favoritesCount + 1 : state.article?.favoritesCount - 1
        }
      });
    case Actions.deleteArticle.type:
      return withEffects(state, Effects.deleteArticle());
    case Actions.articleDeleted.type:
      // todo: redirect to /
      return state;
    case Actions.addComment.type:
      return withEffects(
        _(state, {
          isSubmitting: true,
          commentFormErrors: {}
        }),
        Effects.addComment()
      );
    case Actions.commentAdded.type:
      return _(state, {
        comments: [action.comment].concat(state.comments),
        commentControl: new FormControl(),
        isSubmitting: false
      });
    case Actions.addCommentFailed.type:
      return _(state, {
        isSubmitting: false,
        commentFormErrors: action.errors
      });
    case Actions.deleteComment.type:
      return withEffects(_(state, { deletingCommentId: action.commentId }), Effects.deleteComment(action));
    case Actions.commentDeleted.type:
      return _(state, {
        comments: state.comments.filter((item) => item.id !== state.deletingCommentId),
        deletingCommentId: null
      });
  }
}
