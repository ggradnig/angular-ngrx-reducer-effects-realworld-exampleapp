import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ArticlesService, Comment, CommentsService, UserService } from '../core';
import { Observable } from 'rxjs';
import { State } from './state';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Actions } from './actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-article-page',
  templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {
  model$?: Observable<State>;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.model$ = this.store.select((state) => state.article).pipe(filter((state) => !!state.article));
  }

  onToggleFavorite(favorited: boolean) {
    this.store.dispatch(Actions.toggleFavorite({ favorited }));
  }

  onToggleFollowing(following: boolean) {
    this.store.dispatch(Actions.toggleFollowing({ following }));
  }

  deleteArticle() {
    this.store.dispatch(Actions.deleteArticle());
  }

  addComment() {
    this.store.dispatch(Actions.addComment());
  }

  onDeleteComment(comment: Comment) {
    this.store.dispatch(Actions.deleteComment({ commentId: comment.id }));
  }
}
