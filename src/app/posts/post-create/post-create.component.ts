import { Component } from '@angular/core';
import { AttachSession } from 'protractor/built/driverProviders';
import { style } from '@angular/animations';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create-component.css']
})

export class PostCreateComponent{
  enteredValue = 'a';
  newPost = 'NO CONTENT';

  onAddPost()
  {
    this.newPost = this.enteredValue;
  }
}
