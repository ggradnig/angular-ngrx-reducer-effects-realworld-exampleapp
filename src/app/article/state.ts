import {Article, Comment, User} from '../core';
import {FormControl} from '@angular/forms';

export type State = Model;

export const initialState: State = {};

export type Model = ArticleState & CommentState & UserState;

export type ArticleState = {
  article?: Article;
  commentControl?: FormControl;
  commentFormErrors?: {};
};

export type CommentState = { comments?: Comment[], deletingCommentId?: number };

export type UserState = {
  user?: User;
  canModify?: boolean;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};
