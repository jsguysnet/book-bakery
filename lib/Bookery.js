const fs = require('fs');
const path = require('path');

class Bookery {
    constructor(url) {
        this.url = url;
    }

    list(callback) {
        let self = this;
        
        fs.readdir(self.url, function (error, books) {
            let files = [];

            books.forEach(function (isbn) {
                files.push(path.join(self.url, isbn));
            });

            callback(files);
        })
    }
}

module.exports = exports = Bookery;