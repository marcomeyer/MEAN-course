const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/posts',(req, res) => {
    const post = req.body;
    console.log(post);
    res.status(201).json(
        {
            message: 'Post added successfully'
        }
    );
});

app.use('/api/posts',(req, res) => {
    const posts = [
        { id: 'a408thgg', title: 'First server-side post', content: 'This is coming from the server'},
        { id: 'z3uhgge0', title: 'Second server-side post', content: 'This is coming from the server!'}
    ];

    res.status(200).json({
        message: 'Posts fetched successfully',
        posts});
});

app.use('/',(req, res) => {
    res.send('<a href="/api/posts">GO</a>');
});

module.exports = app;
