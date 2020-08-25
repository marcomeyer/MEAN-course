const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose
  .connect('mongodb+srv://marco:<password>@cluster0.hmuxl.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() =>{
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.post('/api/posts',(req, res) => {
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

app.put('/api/posts/:id', (req, res, next) => {
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

app.get('/api/posts',(req, res) => {
  Post
    .find()
    .then(docs => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs});
    });
});

app.get('/api/posts/:id',(req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

app.delete('/api/posts/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Post.deleteOne({ _id: id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'})
  });
});


app.use('/',(req, res) => {
    res.send('<a href="/api/posts">GO</a>');
});

module.exports = app;
