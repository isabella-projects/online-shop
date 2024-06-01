const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).send('<h1>404</h1><br><p>Page Not Found</p>');
});

app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`);
});
