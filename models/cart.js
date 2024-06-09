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

            const roundedPrice = Math.round(parseFloat(productPrice) * 100) / 100;

            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity += 1;
                updatedProduct.price = roundedPrice;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1, price: roundedPrice };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = Math.round((cart.totalPrice + roundedPrice) * 100) / 100;

            fs.writeFile(p, JSON.stringify(cart), (error) => {
                console.log(error);
            });
        });
    }
};
