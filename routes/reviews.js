const express = require('express');
const router = express.Router({mergeParams:true});

const Court = require('../models/court'); //requrie model
const Review = require('../models/review');//requrie model

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {reviewSchema} = require('../JoicourtSchema');


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async(req,res)=>{
    const court = await Court.findById(req.params.id);
    const review = await new Review(req.body.review);
    court.reviews.push(review);//reviews is the field
    await review.save();
    await court.save();
    req.flash('success','Successfully created new review.')
    res.redirect(`/courts/${court._id}`);
}))
router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Court.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review.')
    res.redirect(`/courts/${id}`)
}))


module.exports = router;