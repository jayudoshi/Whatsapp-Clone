const express = require('express');
const Users = require('../models/user');
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

userRouter.options('/login' , cors.cors , (req,res,next) => {res.sendStatus("200")})
// userRouter.post('/login' , cors.corsWithOpts , passport.authenticate('local',{session:false}) ,(req,res,next) => {
//     if(req.user){
//         const token = getJWT(req.user._id);
//         console.log(token)
//         res.setHeader('Content-Type','application/json');
//         res.statusCode = 200;
//         res.json({success:true , status: "Login Successfully !!" , msg:"User login Sucessfulyy" , token:token});
//     }
// });

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
                    const token = getJWT(req.user._id)
                    console.log(token)
                    res.setHeader('Content-Type','application/json');
                    res.statusCode = 200;
                    res.json({success:true , status: "Login Successfully !!" , msg:"User login Sucessfulyy" , token:token , user:user});
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
            // res.statusCode = 500;
            // res.setHeader('Content-Type','application/json');
            // console.log(err.statusCode);
            // console.log(err.message);
            // res.send({err: err})
            // res.json({err : err.message})
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


userRouter.options('/updateProfile' , cors.cors , (req,res,next) =>{res.sendStatus("200")})
userRouter.post('/updateProfile' , cors.corsWithOpts , verifyUser , upload.single('uploadImage') , (req,res,next) => {
    Users.findByIdAndUpdate(req.user._id , {
        profilePic: req.file.filename,
        about:req.body.about,
        profileSetup:true
    } , 
    {new: true} ,
    (err,user) => {
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
    console.log(req.file)
})

module.exports = userRouter;







const update = {}
    if(req.file){
        req.body.profilePic = req.file.filename
    }
    Users.findByIdAndUpdate(req.user._id, req.body , {new:true} , (err,user) => {
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