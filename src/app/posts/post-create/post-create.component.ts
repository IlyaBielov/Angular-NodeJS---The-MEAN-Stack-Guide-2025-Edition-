import { Component, inject } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Post } from "../post.model";
import { OnInit } from "@angular/core";

import { PostsService } from "../posts.service";

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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('postId')) {
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(({ post }) => {
            this.post = post
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
      form.resetForm();
    }
  }
}
