const fs = require('fs');

class Crawler {
    constructor (url) {
        this.url = url;
        this.start();
    }

    start () {
        console.log('start ' + this.url);
        fs.readdir(this.url, function () {
            console.log(arguments);
        })
    }
}

module.exports = exports = Crawler;