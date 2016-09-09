const fs = require('fs');
const path = require('path');

class Bookery {
    constructor(url) {
        this.url = url;
    }

    list() {
        fs.readdir(self.url, function (error, books) {
            books.forEach(function (isbn) {
                console.log(path.join(self.url, isbn));
            });
        })
    }
}

module.exports = exports = Bookery;