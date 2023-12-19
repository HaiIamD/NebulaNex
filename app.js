require('dotenv').config();

// Require Express
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 5000 || process.env.PORT;

// Mengatur dan membuat session
app.use(
  session({
    secret: 'notess.',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    // cookie: { maxAge: new Date(Date.now() + 3600000) },
  })
);

// initialize Passport dan sesion
app.use(passport.initialize());
app.use(passport.session());

// Connect database
connectDB();

// Membantu kita untuk pass data form dari page ke page maupun ke database
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));

// Tamplating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Route
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));
app.use('/', require('./server/routes/login'));

// Handle Unauthorized
app.get('401', (req, res) => {
  res.status(401).render('401');
});

// Handle 404
app.get('*', function (req, res) {
  res.status(404).render('404');
});

// Listening port running express
app.listen(port, () => {
  console.log(`App listening on port ${port} `);
});
