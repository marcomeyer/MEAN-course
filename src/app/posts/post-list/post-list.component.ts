import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub: Subscription;

  constructor(
    private authService: AuthService,
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe(
        (postData: { posts: Post[], postCount: number }) => {
          this.isLoading = false;
          this.totalPosts = postData.postCount;
          this.posts = postData.posts;
        }
    );

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs =
    this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onDelete(id: string){
    this.isLoading = true;

    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
}
