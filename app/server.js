const express = require('express')
const app = express();
const server = require('http').Server(app);
const path = require('path');

const PORT = 8081;
const HOST = '0.0.0.0';

// web server
server.listen(PORT, HOST);

// HTTP router
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/html/index.html'));
});

// middleware
app.use('/static', express.static(path.join(__dirname, '/../public')));


module.exports = server;
