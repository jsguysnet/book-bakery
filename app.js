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
    let bookery = new Bookery(__dirname + '/books');
    bookery.list(function (data) {
        response.json(data);
    });
});

// route to get book details
app.get('^/list/:isbn([0-9]{3}\-[0-9]\-[0-9]{3}\-[0-9]{5}\-[0-9])$', function (request, response) {
    let bookery = new Bookery(__dirname + '/books');
    let isbn = request.params.isbn;
    bookery.getDetails(isbn, function (data) {
        response.json(data);
    });
});

// route to get book details
app.get('^/list/:isbn([0-9]{3}\-[0-9]\-[0-9]{3}\-[0-9]{5}\-[0-9])/pdf$', function (request, response) {
    let bookery = new Bookery(__dirname + '/books');
    let isbn = request.params.isbn;
    bookery.download(isbn, function (data) {
        response.contentType('application/pdf');
        response.send(Buffer.concat(data));
    });
});

app.post('/upload', function (request, response) {
    let bookery = new Bookery(__dirname + '/books');

    request.params = {
        file: 'tmp/upload.pdf',
        isbn: '978-2-345-85423-1',
        title: "jogging joghurt",
        year: 2015,
        genre: "sports",
        author: 'Eddie',
        edition: 5
    };

    bookery.upload(request.params, function (data) {
        response.json(data);
    });
});

// route to catch a filter on the list
/*app.get('/list/:query', function (request, response) {
    console.log(request.params);
    response.send({
        test: 123
    });
}); */

// route to catch every other call
app.get('*', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

// standard express call to start the webserver
app.listen(port, () => {
    console.log('listening on port ' + port);
});