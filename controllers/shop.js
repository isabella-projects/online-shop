const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (_req, res, _next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                docTitle: 'All Products',
                path: '/products',
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getProduct = (req, res, _next) => {
    const productId = req.params.productId;

    /* ---- Alternative way with by quering ------ */

    // Product.findAll({ where: { id: productId } })
    //     .then((products) => {
    //         res.render('shop/product-detail', {
    //             product: products[0],
    //             docTitle: products[0].title,
    //             path: '/products',
    //         });
    //     })
    //     .catch((error) => console.log(error));
    /* -------------------------------------------- */

    Product.findByPk(productId)
        .then((product) => {
            console.log(product);
            res.render('shop/product-detail', {
                product: product,
                docTitle: product.title,
                path: '/products',
            });
        })
        .catch((error) => console.log(error));
};

exports.getIndex = (_req, res, _next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Shop',
                path: '/',
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getCart = (_req, res, _next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = [];

            for (product of products) {
                const cartProductData = cart.products.find((prod) => prod.id === product.id);

                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        quantity: cartProductData.quantity,
                        price: cartProductData.price,
                    });
                }
            }

            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Your Cart',
                products: cartProducts,
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your Orders',
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        docTitle: 'Checkout',
    });
};
