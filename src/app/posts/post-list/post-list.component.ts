import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub: Subscription;

  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe(
        (posts: Post[]) => {
          this.isLoading = false;
          this.posts = posts;
        }
      );
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onDelete(id: string){
    this.postsService.deletePost(id);
  }

  onChangedPage(pageData: PageEvent) {

  }
}
