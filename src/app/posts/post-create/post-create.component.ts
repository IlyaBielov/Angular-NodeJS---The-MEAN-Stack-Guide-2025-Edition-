import { Component, inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Post } from "../post.model";
import { OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from "../posts.service";
import { mimeTypeValidator } from './mime-type.validator';

@Component({
    selector: "app-post-create",
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.css"],
    standalone: false
})
export class PostCreateComponent implements OnInit {
  public postsService = inject(PostsService);
  public route = inject(ActivatedRoute);
  private mode = 'create';
  private postId: string;
  public post: Post;
  public isLoading = false;
  public form: FormGroup
  public imagePreview: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      content: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      })
    });

    this.route.paramMap.subscribe(params => {
      if (params.has('postId')) {
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(({ post }) => {
            this.post = post
            this.isLoading = false;
            this.form.setValue({
              title: post.title,
              content: post.content,
              image: post.imagePath,
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'edit') {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  onImagePicked($event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
