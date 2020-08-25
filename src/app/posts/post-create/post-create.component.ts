import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create-component.css']
})

export class PostCreateComponent implements OnInit{
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.postId = paramMap.get('postId');
      this.mode = (this.postId == null) ? 'create' : 'edit';

      this.isLoading = true;

      this.postsService.getPost(this.postId).subscribe(postData => {
        this.post = {id: postData._id, title: postData.title, content: postData.content };

        this.isLoading = false;
      });
    });
  }

  onSavePost(form: NgForm)
  {
    if (form.invalid) {
     return;
    }

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }
}
