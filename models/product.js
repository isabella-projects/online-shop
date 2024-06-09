const fs = require('fs');
const path = require('path');
const ShortUniqueId = require('short-unique-id');
const { randomUUID } = new ShortUniqueId({ length: 10 });
const { rootDir } = require('../util/path');

const Cart = require('../models/cart');

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
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = +price;
    }

    save() {
        getProducsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                });
            } else {
                this.id = randomUUID();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products, null, 4), (error) => {
                    console.log(error);
                });
            }
        });
    }

    static deleteById(id) {
        getProducsFromFile((products) => {
            const product = products.find((prod) => prod.id === id);
            const updatedProducts = products.filter((prod) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts, null, 4), (error) => {
                if (!error) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(callback) {
        getProducsFromFile(callback);
    }

    static findById(id, callback) {
        getProducsFromFile((products) => {
            const product = products.find((prod) => prod.id === id);
            callback(product);
        });
    }
};
