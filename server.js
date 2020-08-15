const http = require('http');

const server = http.createServer((req, res) => {
    res.end('The response');
});

server.listen(process.env.PORT || 3000);
