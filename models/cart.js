const fs = require('fs');
const path = require('path');
const { rootDir } = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (error, fileContent) => {
            let cart = { products: [], totalPrice: 0 };

            if (!error) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity += 1;
                updatedProduct.price = +productPrice;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1, price: +productPrice };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice += +productPrice;

            fs.writeFile(p, JSON.stringify(cart, null, 4), (error) => {
                console.log(error);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                return;
            }

            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find((prod) => prod.id === id);
            const productQuantity = product.quantity;

            updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;

            fs.writeFile(p, JSON.stringify(updatedCart, null, 4), (error) => {
                console.log(error);
            });
        });
    }

    static getCart(callback) {
        fs.readFile(p, (error, fileContent) => {
            const cart = JSON.parse(fileContent);

            if (error) {
                callback(null);
            } else {
                callback(cart);
            }
        });
    }
};
