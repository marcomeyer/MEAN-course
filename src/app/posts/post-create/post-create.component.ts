import { Component } from '@angular/core';
import { AttachSession } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})

export class PostCreateComponent{
  newPost="NO CONTENT"
  onAddPost(postInput:HTMLTextAreaElement)
  {
    console.dir(postInput)
    this.newPost = postInput.value
  }
}
