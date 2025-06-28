import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>("http://localhost:3000/api/posts")
      .subscribe(postData => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ message: string; post: Post }>("http://localhost:3000/api/posts/" + id)
  }

  addPost(title: string, content: string) {
    const postReq: Post = { _id: null, title: title, content: content };
    this.http
      .post<{ message: string, post: Post }>("http://localhost:3000/api/posts", postReq)
      .subscribe(({ post }) => {
        this.posts = [...this.posts, post];
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const postReq: Post = { _id: id, title: title, content: content };

    this.http
      .patch<{ message: string, post: Post }>("http://localhost:3000/api/posts/" + id, postReq)
      .subscribe(({ post }) => {
        const updatedPosts = this.posts.map(post => post._id === id ? post : post);
        this.posts = [...updatedPosts];
        this.postsUpdated.next([...updatedPosts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/posts/" + id)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post._id !== id);
        this.posts = [...updatedPosts];
        this.postsUpdated.next([...updatedPosts]);
      })
  }
}
