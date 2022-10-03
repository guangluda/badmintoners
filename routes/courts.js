const express = require('express');
const router = express.Router();
const Court = require('../models/court'); //requrie model
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {courtSchema} = require('../JoicourtSchema');
const {isLoggedIn, isAuthor, validateCourt} = require('../middleware');
const multer  = require('multer');
const { storage, cloudinary } = require('../cloudinary');
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});


router.get('/', async (req,res)=>{
    const courts = await Court.find({});
    res.render('courts/index',{courts});
})
router.get('/new', isLoggedIn, (req,res)=>{  //order matters, need to before :id
    res.render('courts/new');
})
router.post('/', isLoggedIn, upload.array('image'), validateCourt, catchAsync(async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query:req.body.court.location,
        limit:1
    }).send()
    const court = new Court(req.body.court);
    court.geometry = geoData.body.features[0].geometry;
    court.images = req.files.map(f=>({url:f.path, filename:f.filename}));
    court.author = req.user._id;
    await court.save();
    // console.log(court);
    req.flash('success','Successfully made a new court.')
    res.redirect(`/courts/${court._id}`);
}))

// router.post('/',upload.array('image'), (req,res)=>{
//     console.log(req.body, req.files)
//     res.send('It worked!')
// })

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
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCourt, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const court = await Court.findByIdAndUpdate(id,{...req.body.court});
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}));
    court.images.push(...imgs);
    // console.log(req.body)
    await court.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await court.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
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