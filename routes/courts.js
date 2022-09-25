const express = require('express');
const router = express.Router();
const Court = require('../models/court'); //requrie model
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {courtSchema} = require('../JoicourtSchema');




const validateCourt = (req,res,next)=>{
    const {error} = courtSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}


router.get('/', async (req,res)=>{
    const courts = await Court.find({});
    res.render('courts/index',{courts});
})
router.get('/new',(req,res)=>{  //order matters, need to before :id
    res.render('courts/new');
})
router.post('/', validateCourt, catchAsync(async(req,res)=>{
    const court = new Court(req.body.court);
    await court.save();
    req.flash('success','Successfully made a new court.')
    res.redirect(`/courts/${court._id}`);
}))
router.get('/:id', catchAsync(async (req,res)=>{
    const {id} =req.params;
    const court = await Court.findById(id).populate('reviews');
    if(!court){
        req.flash('error','Cannot find that court!');
        return res.redirect('/courts');
    }
    res.render('courts/show',{court});
}))
router.get('/:id/edit',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findById(id);
    res.render('courts/edit',{court});
}))
router.put('/:id', validateCourt, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findByIdAndUpdate(id,{...req.body.court});
    console.log(req.body)
    req.flash('success','Successfully updated the court.')
    res.redirect(`/courts/${court._id}`);
}))
router.delete('/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Court.findByIdAndDelete(id);
    req.flash('success','Successfully deleted court.')
    res.redirect('/courts');
}))


module.exports = router;