require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { getViewsPath, getSequelizeMethods, rootDir } = require('./util/helpers');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const PORT = process.env.PORT || 3000;
const app = express();

const viewEngine = process.env.VIEW_ENGINE;
const viewsPath = getViewsPath(viewEngine);

app.set('view engine', viewEngine);
app.set('views', path.join(rootDir, viewsPath));

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, _res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((error) => {
            console.log(error);
        });
});

app.use('/admin', adminData);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    .sync()
    .then((_result) => {
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user) {
            return User.create({
                name: 'Bella',
                email: 'test@est.com',
            });
        }
        return Promise.resolve(user);
    })
    .then((_user) => {
        app.listen(PORT, () => {
            console.log(`Express server is listening on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
