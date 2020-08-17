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
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  private post: Post;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.postId = paramMap.get('postId');
      this.mode = (this.postId == null) ? 'create' : 'edit';
      this.post = (this.postId == null) ? null : this.postsService.getPost(this.postId);
    });
  }

  onAddPost(form: NgForm)
  {
    if (form.invalid) {
     return;
    }

    this.postsService.addPost(form.value.title, form.value.content);

    form.resetForm();
  }
}
