const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class Bookery {
    constructor(url) {
        this.url = url;
    }

    list(callback) {
        let bookEventEmitter = new EventEmitter();

        bookEventEmitter.on('booksready', function (data) {
            callback(data);
        });

        let bakery = {};
        let self = this;
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
                                bookEventEmitter.emit('booksready', bakery);
                            }
                        })
                    }
                })
            });
        })
    }
}

module.exports = exports = Bookery;