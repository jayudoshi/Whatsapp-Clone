const express = require('express');
const Users = require('../models/user');
const Contacts = require('../models/contact')
const passport = require('passport');
const userRouter = express.Router();
const {getJWT, verifyToken, verifyUser} = require('../authenticate');
const cors = require('../cors');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        return cb(null , 'public/images/profilepicture');
    },
    filename: (req,file,cb) => {
        return cb(null,req.user.username + path.extname(file.originalname))
    }
})

const filterFile = (req,file,cb) => {
    if(file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        cb(null , true)
    }else{
        cb(new Error("Invalid File Type !!"),false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filterFile
})

userRouter.options('/' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.get('/' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    let regex
    regex = req.query.searchText ? new RegExp(req.query.searchText,"i") : /[\S]/i;
    console.log(regex)
    // name: { $regex: regex}
    req.body.contactLength = req.query.contactLength ? req.query.contactLength : 0;
    Users.find({name: { $regex: regex}} , 'username name about profilePic' , (err,users) => {
        if(err){
            res.statusCode = 500;
            console.log(err)
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request"})
        }else{
            // console.log(users)
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Request Successfull" , users:users});
        }
    }).skip(parseInt(req.body.contactLength)).limit(7)
})

userRouter.options('/contacts' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.get('/contacts' , cors.corsWithOpts , verifyUser , (req,res,next) =>{
    Contacts.find({userId: req.user._id} , 'username name about' , (err , contacts) => {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err})
        }else{
            res.statusCode = 200;
            res.setHeader('Contet-Type','application/json');
            res.json({success:true , status:"Request Successfull" , contacts: contacts})
        }
    })
    .populate('userId')
    .populate('contacts')
})
userRouter.post('/contacts' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    const document = 
    Contacts.create({userId: req.user._id , contacts: req.body.contacts} , (err,contact) => {
        if(err){
            res.statusCode = 500;
            console.log(err)
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err})
        }else{
            res.statusCode = 200;
            res.setHeader('Contet-Type','application/json');
            res.json({success:true , status:"Request Successfull" , contacts: contact})    
        }
    })
    // .populate('userId')
    // .populate('contacts')
})

userRouter.options('/login' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.post('/login' , cors.corsWithOpts , (req,res,next) => {
    passport.authenticate('local' , {session:false} , (err , user ,info) => {
        if(err){
            console.log(err);
        }
        if(!user){
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Login Failed !!" , err:info});
        }
        if(user){
            req.logIn(user , {session:false} , (err) => {
                if(err){
                    console.log("login 1 If")
                    console.log(info)
                    res.statusCode = 401;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:false , status:"Login Failed" , err:info})
                }else{
                    console.log("login else")
                    res.setHeader('Content-Type','application/json');
                    res.statusCode = 200;
                    res.json({success:true , status: "Login Successfully !!" , msg:"User login Sucessfulyy" , token:getJWT(req.user._id) , user:user});
                }
            })
        }
    })(req,res,next)
})

userRouter.options('/register' , cors.cors , (req,res,next) => {res.sendStatus("200")})
userRouter.post('/register' , cors.corsWithOpts , (req,res,next) => {
    Users.register({username: req.body.username} , req.body.password , (err,user) => {
        if(err){
            res.status(500).send({success: false , status: "Registration Unsuucessfull !!" , err: err})
        }else{
            if(req.body.name){
                user.name = req.body.name
            }
            user.save((err, user) => {
                if (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({success: false , status: "Registration Unsuucessfull !!" , err: err});
                  return ;
                }
                passport.authenticate('local')(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({success: true, status: 'Registration Successful!'});
                });
            })
        }
    })
})

userRouter.options('/updateProfile' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.post('/updateProfile' , cors.corsWithOpts , verifyUser , upload.single('profilePic') , (req,res,next) => {
    const update = {
        about:req.body.about,
        profileSetup:true
    }
    if(req.file){
        update.profilePic= req.file.filename;
    }
    Users.findByIdAndUpdate(req.user._id, update , {new:true}
     , (err,user) => {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Profile Setup Failed !!" , err:err})
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Profile Setup Completed !!" , user:user})
        }
    })
})

userRouter.put('/updateProfile' , cors.corsWithOpts , verifyUser , upload.single('profilePic') , (req,res,next) => {
    if(req.file)
        req.body.profilePic = req.file.filename
    Users.findByIdAndUpdate(req.user._id , req.body , {new:true} , (err , user) => {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Failed to Update Profile!!" , err:err})
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Profile Successfully Updated!!" , user:user})
        }
    })
})

module.exports = userRouter;