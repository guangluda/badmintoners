const express = require('express');
const router = express.Router();
const passport = require('passport');
const { nextTick } = require('process');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {checkReturnTo}= require('../middleware');

router.get('/register', (req,res)=>{
    res.render('users/register');
})
router.post('/register', async(req,res)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=>{  // for registered user stay login
            if (err) return next(err);
            req.flash('success','Welcome to badmintoners!')
            res.redirect('/courts');
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }   
})
router.get('/login',(req,res)=>{
    res.render('users/login')
})
router.post('/login', checkReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req,res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl = res.locals.returnTo || '/courts'
    // console.log(res.locals.returnTo)
    // delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout',(req,res)=>{
    req.logout(req.user,err=>{
        if(err) return nextTick(err);
        res.redirect('/courts')
    }); //from passport // this is new feature by passport upgrade requires a callback
    // req.flash('success','Bye!');
    // res.redirect('/courts');
})

module.exports = router;