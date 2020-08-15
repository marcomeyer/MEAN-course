const express = require('express');

const app = express();

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
