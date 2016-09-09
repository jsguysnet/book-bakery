let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');

let Bookery = require(__dirname + '/lib/Bookery.js');

let app = express();
let port = 2016;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// route to get a list of all books
app.get('/list', function (request, response) {
    response.send('book list');
});

// route to get book details
app.get('^/list/:isbn([0-9]{3}\-[0-9]\-[0-9]{3}\-[0-9]{5}\-[0-9])$', function (request, response) {
    let isbn = request.params.isbn;
    response.send('book details for isbn ' + isbn);
});

// route to get book details
app.get('^/list/:isbn([0-9]{3}\-[0-9]\-[0-9]{3}\-[0-9]{5}\-[0-9])/pdf$', function (request, response) {
    let isbn = request.params.isbn;
    response.send('pdf for isbn ' + isbn);
});

app.post('/upload', function (request, response) {
    response.send('file upload');
});

// route to catch every other call
app.get('*', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

// standard express call to start the webserver
app.listen(port, function () {
    console.log('listening on port ' + port);
});