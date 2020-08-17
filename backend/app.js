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
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
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

app.get('/api/posts',(req, res) => {
  Post
    .find()
    .then(docs => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs});
    });
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
