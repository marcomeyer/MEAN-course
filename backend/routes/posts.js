const express = require("express");
const router = express.Router();
const multer = require('multer');

const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jng',
  'image/jpg': 'jng',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if(isValid) {
      error = null;
    }

    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
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

router.post('', multer({storage: storage}).single('image'), (req, res) => {
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

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Post.deleteOne({ _id: id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'})
  });
});

module.exports = router;
