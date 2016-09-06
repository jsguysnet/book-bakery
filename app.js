let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');

let Crawler = require(__dirname + '/lib/Crawler.js');

let app = express();
let port = 2016;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// route to get a list of all books
app.get('/list', function (request, response) {
    let crawler = new Crawler(__dirname + '/books');
    response.setHeader('Content-Type', 'application/json');
    response.send(require(__dirname + '/data/list.json'));
});

// route to get book details
app.get('^/list/:isbn([0-9]{3}\-[0-9]\-[0-9]{3}\-[0-9]{5}\-[0-9])$', function (request, response) {
    console.log(request.params);
    response.send({
        test: 123
    });
});

// route to catch a filter on the list
app.get('/list/:query', function (request, response) {
    console.log(request.params);
    response.send({
        test: 123
    });
});

// route to catch every other call
app.get('*', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

// standard express call to start the webserver
app.listen(port, () => {
    console.log('listening on port ' + port);
});