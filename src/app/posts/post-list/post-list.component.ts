import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  imports: [
    MatProgressSpinner,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelActionRow,
    MatPaginator,
    RouterLink,
    MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostListComponent implements OnInit {
  posts = signal<Post[]>([]);
  isLoading = signal(false) ;
  totalPosts = signal(0);
  isAuthenticated = signal(true);
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  public postsService = inject(PostsService);
  public authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isLoading.set(true);
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    this.postsService.getPostUpdateListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((postData: { maxCount: number, posts: Post[] }) => {
        this.posts.set(postData.posts);
        this.totalPosts.set(postData.maxCount);
        this.isLoading.set(false);
      });

    this.isAuthenticated.set(this.authService.getIsAuth())
    this.authService.getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        this.isAuthenticated.set(isAuthenticated)
      })
  }

  onDelete(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChange($event:  PageEvent) {
    this.currentPage = $event.pageIndex + 1;
    this.postsPerPage = $event.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
