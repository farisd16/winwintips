const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const compression = require('compression');
const dotenv = require('dotenv');

const User = require('./models/user');

dotenv.config();

const MONGO_DB = process.env.NODE_ENV == 'production' ? 'winwintips' : 'winwintipsdev';
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j4o5h.mongodb.net/${MONGO_DB}`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'pug');
app.set('views', 'views');

const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.captchaPublicKey = process.env.V2_PUBLIC;
    next();
});
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User
    .findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
        next(new Error(err));
    });
});

app.use(clientRoutes);
app.use(adminRoutes);
app.use(errorController.get404);
app.use(errorController.get500);

mongoose
.connect(MONGODB_URI)
.then(result => {
    const server = app.listen(process.env.PORT);
})
.catch(err => {
    console.log(err);
})