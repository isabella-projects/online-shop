const fs = require('fs');
const path = require('path');
const { rootDir } = require('../util/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProducsFromFile = (callback) => {
    fs.readFile(p, (error, fileContent) => {
        if (error) {
            return callback([]);
        } else {
            callback(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProducsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log(error);
            });
        });
    }

    static fetchAll(callback) {
        getProducsFromFile(callback);
    }
};
