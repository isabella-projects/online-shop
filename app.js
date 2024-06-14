require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { getViewsPath, rootDir } = require('./util/path');

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

app.use('/admin', adminData);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    .sync({ force: true })
    .then((_result) => {
        app.listen(PORT, () => {
            console.log(`Express server is listening on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
