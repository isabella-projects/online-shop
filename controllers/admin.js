const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add New Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })
        .then((_result) => {
            console.log('Created product');
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const productId = req.params.productId;
    Product.findByPk(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }

            res.render('admin/edit-product', {
                docTitle: 'Add New Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
            });
        })
        .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, _next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    Product.findByPk(productId)
        .then((product) => {
            (product.title = updatedTitle),
                (product.price = updatedPrice),
                (product.description = updatedDescription),
                (product.imageUrl = updatedImageUrl);

            return product.save();
        })
        .then((_result) => {
            console.log('Product successfully updated!');
            res.redirect('/admin/products');
        })
        .catch((error) => console.log(error));
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                docTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
        .then((product) => {
            return product.destroy();
        })
        .then((_result) => {
            console.log('Product successfully deleted!');
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.log(error);
        });
};
