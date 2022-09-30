const express = require('express');
const router = express.Router();
const Court = require('../models/court'); //requrie model
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {courtSchema} = require('../JoicourtSchema');
const {isLoggedIn, isAuthor, validateCourt} = require('../middleware');



router.get('/', async (req,res)=>{
    const courts = await Court.find({});
    res.render('courts/index',{courts});
})
router.get('/new', isLoggedIn, (req,res)=>{  //order matters, need to before :id
    res.render('courts/new');
})
router.post('/', isLoggedIn, validateCourt, catchAsync(async(req,res)=>{
    const court = new Court(req.body.court);
    court.author = req.user._id;
    await court.save();
    req.flash('success','Successfully made a new court.')
    res.redirect(`/courts/${court._id}`);
}))
router.get('/:id', catchAsync(async (req,res)=>{
    const {id} =req.params;
    // const court = await Court.findById(id).populate('reviews').populate('author');
    const court = await Court.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(court)
    if(!court){
        req.flash('error','Cannot find that court!');
        return res.redirect('/courts');
    }
    res.render('courts/show',{court});
}))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findById(id);
    res.render('courts/edit',{court});
}))
router.put('/:id', isLoggedIn, isAuthor, validateCourt, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findByIdAndUpdate(id,{...req.body.court});
    console.log(req.body)
    req.flash('success','Successfully updated the court.')
    res.redirect(`/courts/${court._id}`);
}))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Court.findByIdAndDelete(id);
    req.flash('success','Successfully deleted court.')
    res.redirect('/courts');
}))


module.exports = router;