const express = require("express");
const router = express.Router();

const Post = require('../models/post');

router.post('',(req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then(createdPost => {

    res.status(201).json(
      {
          message: 'Post added successfully',
          id: createdPost._id
      }
    );
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({message: 'Update successful!'});
  });

});

router.get('',(req, res) => {
  Post
    .find()
    .then(docs => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs});
    });
});

router.get('/:id',(req, res, next) => {
Post.findById(req.params.id).then(post => {
  if(post){
    res.status(200).json(post);
  }
  else {
    res.status(404).json({message: 'Post not found!'});
  }
})
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Post.deleteOne({ _id: id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'})
  });
});

module.exports = router;
