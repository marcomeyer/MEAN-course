import { Post } from './post.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];

    getPosts() {
        return [... this.posts]; // create a copy
    }

    addPost(title: string, content: string) {
        const post: Post = {title, content};

        this.posts.push(post);
    }
}
