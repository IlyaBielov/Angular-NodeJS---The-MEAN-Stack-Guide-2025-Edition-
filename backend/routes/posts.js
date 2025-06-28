const express = require('express');
const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      post: result,
    });
  });
});

router.get("", (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: posts
      });
    })
});

router.patch("/:id", (req, res) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  })

  Post.updateOne({ _id: req.params.id }, post)
    .then(result =>
      res.status(200)
        .json({ message: "Post updated!", post: result }));
})

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.status(200).json({
        message: "Post fetched successfully!",
        post: post
      });
    })
})

router.delete("/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result =>
      res.status(200)
        .json({ message: "Post deleted!", post: result }));
})

module.exports = router;
