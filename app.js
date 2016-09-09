let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

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

app.post('/upload', upload.single('file'), function (request, response) {
    let bookery = new Bookery(__dirname + '/books');

    request.body.file = request.file.path;
    bookery.upload(request.body, function (data) {
        response.redirect('/#' + (data.success ? 'success' : 'failed'));
    });
});

// route to catch every other call
app.get('*', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

// standard express call to start the webserver
app.listen(port, function () {
    console.log('listening on port ' + port);
});