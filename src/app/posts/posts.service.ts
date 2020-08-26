import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {

    private url = 'http://localhost:3000/api/posts';

    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getPosts() {
      this.http
        .get<{message: string, posts: any}>(this.url)
        .pipe(map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        }))
        .subscribe((tranformedPosts) => {
          this.posts = tranformedPosts;
          this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
      return this.http.get<{_id: string, title: string, content: string}>(`${this.url}/${id}`);
    }

    addPost(title: string, content: string, image: File) {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

      this.http
          .post<{ message: string, postId: string }>(this.url, postData)
          .subscribe((responseData) => {
              const post: Post = { id: responseData.postId, title: title, content: content };

              const id = responseData.postId;
              post.id = id;
              this.posts.push(post);
              this.postsUpdated.next([...this.posts]);
              this.router.navigate(['/']);
          });
    }

    updatePost(id: string, title: string, content: string) {
      const post: Post = {id, title, content};
      this.http
          .put(this.url + '/' + id, post)
          .subscribe(response => {
              const updatedPosts = [...this.posts];
              const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
              updatedPosts[oldPostIndex] = post;
              this.postsUpdated.next([...this.posts]);
              this.router.navigate(['/']);
          });
    }

    deletePost(id: string) {
      this.http
        .delete(this.url + '/' + id)
        .subscribe((result: {message} ) => {
          const updatedPosts = this.posts.filter(post => post.id !== id);
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);

          console.log('Deleted: ' + result.message);
        });
    }
}
