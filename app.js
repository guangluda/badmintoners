const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Court = require('./models/court'); //requrie model
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const courtSchema = require('./JoicourtSchema');

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


const validateCourt = (req,res,next)=>{
    const {error} = courtSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}


app.get('/',(req,res)=>{
    res.render('home')
});

app.get('/courts', async (req,res)=>{
    const courts = await Court.find({});
    res.render('courts/index',{courts});
})
app.get('/courts/new',(req,res)=>{  //order matters, need to before :id
    res.render('courts/new');
})
app.post('/courts', validateCourt, catchAsync(async(req,res)=>{
    const court = new Court(req.body.court);
    await court.save();
    res.redirect(`/courts/${court._id}`);
}))
app.get('/courts/:id', catchAsync(async (req,res)=>{
    const {id} =req.params;
    const court = await Court.findById(id);
    res.render('courts/show',{court});
}))
app.get('/courts/:id/edit',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findById(id);
    res.render('courts/edit',{court});
}))
app.put('/courts/:id', validateCourt, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findByIdAndUpdate(id,{...req.body.court});
    console.log(req.body)
    console.log(court)
    res.redirect(`/courts/${court._id}`);
}))
app.delete('/courts/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Court.findByIdAndDelete(id);
    res.redirect('/courts');
}))

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