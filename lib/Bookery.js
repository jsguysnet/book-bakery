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
        let url = path.join(self.url, isbn, 'meta.json');

        self.bookBakeryEmitter.on('detailsready', function (data) {
            callback(data);
        });

        fs.exists(url, function (exists) {
            if (exists) {
                let book = fs.createReadStream(url);
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

    download(isbn, callback) {
        let self = this;
        let url = path.join(self.url, isbn, 'book.pdf');

        self.bookBakeryEmitter.on('detailsready', function (data) {
            callback(data);
        });

        fs.exists(url, function (exists) {
            if (exists) {
                let book = fs.createReadStream(url);
                let document = [];

                book.on('data', function (data) {
                    document.push(data);
                });

                book.on('end', function () {
                    self.bookBakeryEmitter.emit('detailsready', document);
                })
            }
            else {
                callback({});
            }
        });
    }

    upload(data, callback) {
        let self = this;
        let isbn = data['isbn'];
        let url = path.join(self.url, isbn);

        self.bookBakeryEmitter.on('uploadready', function (data) {
            callback(data);
        });

        if (!fs.existsSync(url)) {
            fs.mkdirSync(url, '0777');

            let uploaded = fs.createReadStream(data['file']);
            let target = fs.createWriteStream(path.join(url, 'book.pdf'));

            uploaded.pipe(target);

            let meta = fs.createWriteStream(path.join(url, 'meta.json'));

            delete(data['file']);
            delete(data['isbn']);

            meta.write(JSON.stringify(data), 'utf-8');

            callback({success: true});
        }
        else {
            callback({success: false, msg: 'Das Buch existiert bereits.'});
        }
    }
}

module.exports = exports = Bookery;