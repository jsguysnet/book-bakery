let Bookery = require(__dirname + '/lib/Bookery.js');

let bookery = new Bookery(__dirname + '/books');
bookery.list(function (data) {
    response.json(data);
});
