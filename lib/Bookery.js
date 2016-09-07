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
                let bookUrl = self.url + path.sep + isbn;
                fs.exists(bookUrl + path.sep + 'meta.json', function (exists) {
                    if (exists) {
                        let book = fs.createReadStream(bookUrl + path.sep + 'meta.json');
                        let tmpData = '';

                        book.on('data', function (data) {
                            tmpData += data.toString();
                        });

                        book.on('end', function () {
                            bakery[isbn] = JSON.parse(tmpData);

                            if (--remain === 0) {
                                self.bookBakeryEmitter.emit('booksready', bakery);
                            }
                        })
                    }
                })
            });
        })
    }

    getDetails(isbn, callback) {
        let self = this;
        let bakery = {};
        let bookUrl = self.url + path.sep + isbn;

        self.bookBakeryEmitter.on('detailsready', function (data) {
            callback(data);
        });

        fs.exists(bookUrl + path.sep + 'meta.json', function (exists) {
            if (exists) {
                let book = fs.createReadStream(bookUrl + path.sep + 'meta.json');
                let tmpData = '';

                book.on('data', function (data) {
                    tmpData += data.toString();
                });

                book.on('end', function () {
                    bakery[isbn] = JSON.parse(tmpData);
                    self.bookBakeryEmitter.emit('detailsready', bakery);
                })
            }
            else {
                callback({});
            }
        });
    }
}

module.exports = exports = Bookery;