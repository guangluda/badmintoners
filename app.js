const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const Court = require('./models/court'); //requrie model
const Review = require('./models/review');//requrie model
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const {courtSchema, reviewSchema} = require('./JoicourtSchema');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const courtRoutes = require('./routes/courts');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')



mongoose.connect('mongodb://localhost:27017/badmintonclash');

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('Databas connected!')
})

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public'))); //tell express to serve our public directory

sessionConfig = {
    secret:'notgood',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //make sure session() is before passport.session()
passport.use(new LocalStrategy(User.authenticate()));//require User model
//user local strategy which is required here
//User.authenticate() User.serializeUser() User.deserializeUser() those methods from user model thanks to passport-local-mongoose

passport.serializeUser(User.serializeUser());  //store in the session
passport.deserializeUser(User.deserializeUser());  //unstore in the session

app.use((req,res,next)=>{
    if(!['/login','/register','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    // console.log(req.session)
    res.locals.currentUser = req.user; //from passport
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/',(req,res)=>{
    res.render('home')
});

app.use('/courts', courtRoutes);
app.use('/courts/:id/reviews', reviewRoutes);
app.use('/',userRoutes);



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found!',404));
})

app.use((err,req,res,next)=>{
    // const {statusCode = 500, message = 'Something went wrong!'} = err;
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh, something went wrong!';
    res.status(statusCode).render('error',{err});
})


app.listen(3000,()=>{
    console.log('Listening on port 3000!')
})