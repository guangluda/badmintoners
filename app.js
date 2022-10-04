if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const courtRoutes = require('./routes/courts');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/badmintonclash';
// const dbUrl = 'mongodb://localhost:27017/badmintonclash';
// mongoose.connect('mongodb://localhost:27017/badmintonclash');
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('Database connected!')
})

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public'))); //tell express to serve our public directory
app.use(mongoSanitize());

const secret = process.env.SECRET ||'notgood';
const store = MongoStore.create({
    mongoUrl:dbUrl,
    secret,
    touchAfter:24*60*60
})
store.on('error',function(e){
    console.log('Session store error.',e)
})
sessionConfig = {
    store,
    name:'ian',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        //secure:true, localhost is not http secure, means cookie only work over https
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(helmet({
    crossOriginEmbedderPolicy:false,
}));
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/do2m8d7kl/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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
app.get('/clubs', (req,res)=>{
    res.render('clubs/index');
})
app.get('/contact', (req,res)=>{
    res.render('contact');
})


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

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}!`)
})