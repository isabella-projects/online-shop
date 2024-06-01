const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        docTitle: 'Page Not Found',
    });
});

app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`);
});
