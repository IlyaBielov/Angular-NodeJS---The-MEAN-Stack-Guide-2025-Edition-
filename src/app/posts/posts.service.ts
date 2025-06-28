import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ maxCount: number, posts: Post[] }>();

  getPosts(postsPerPage: number = 2, currentPage: number = 1) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: Post[], maxCount: number }>("http://localhost:3000/api/posts" + queryParams)
      .pipe(
        map(postData => ({
          posts: postData.posts,
          maxCount: postData.maxCount,
        }))
      )
      .subscribe(({ posts, maxCount }) => {
        this.posts = posts;
        this.postsUpdated.next({ maxCount, posts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ message: string; post: Post }>("http://localhost:3000/api/posts/" + id)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string, post: Post }>("http://localhost:3000/api/posts", postData)
      .subscribe(({ post }) => this.router.navigate(["/"]));
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData

    if (typeof image === "object") {
      postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);

    } else {
      postData = { _id: id, title: title, content: content, imagePath: image };
    }

    this.http
      .patch<{ message: string, post: Post }>("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(({ post }) => this.router.navigate(["/"]));
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>("http://localhost:3000/api/posts/" + id)
  }
}
