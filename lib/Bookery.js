const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class Bookery {
    constructor(url) {
        this.url = url;
        this.bookBakeryEmitter = new EventEmitter();
    }

    list(callback) {
        let bakery = {};
        let self = this;

        self.bookBakeryEmitter.on('booksready', function (data) {
            callback(data);
        });

        fs.readdir(self.url, function (error, books) {
            let remain = books.length;

            books.forEach(function (isbn) {
                console.log(path.join(self.url, isbn));
            });
        })
    }
}

module.exports = exports = Bookery;