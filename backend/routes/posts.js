const express = require('express');
const Post = require("../models/post");
const multer = require("multer");
const fs = require('fs');


const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = !isValid ? new Error('Invalid mime type') : null;

    if (!error) {
      const uploadPath = 'backend/images';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    }

    cb(error, 'backend/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleString().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", multer({ storage: storage }).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
  });

  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      post: result,
    });
  });
});

router.get("", (req, res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then((posts) => {
      fetchPosts = posts
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchPosts,
        maxCount: count,
      });
    })
});

router.patch("/:id",  multer({ storage: storage }).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file ? url + '/images/' + req.file.filename : req.body.imagePath,
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
