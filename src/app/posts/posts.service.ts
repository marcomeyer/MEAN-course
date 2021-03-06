import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class PostsService {

    private url = environment.apiUrl + '/posts';

    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getPosts(postsPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

      this.http
        .get<{message: string, posts: any, maxPosts: number}>(this.url + queryParams)
        .pipe(map(postData => {
          return { posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
        }))
        .subscribe((tranformedPostData) => {
          this.posts = tranformedPostData.posts;

          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: tranformedPostData.maxPosts
          });
        });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
      return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string }>(`${this.url}/${id}`);
    }

    addPost(title: string, content: string, image: File) {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

      this.http
          .post<{ message: string, post: Post }>(this.url, postData)
          .subscribe((responseData) => {
              this.router.navigate(['/']);
          });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
      let postData: Post | FormData;

      if (typeof image === 'object'){
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
      } else {
        postData = {id, title, content, imagePath: image, creator: null };
      }

      this.http
          .put(this.url + '/' + id, postData)
          .subscribe(response => {
              this.router.navigate(['/']);
          });
    }

    deletePost(id: string) {
      return this.http
        .delete(this.url + '/' + id);
    }
}
