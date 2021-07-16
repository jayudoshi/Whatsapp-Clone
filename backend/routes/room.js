const express = require('express');
const Users = require('../models/user')
const Rooms = require('../models/room');
const Chats = require('../models/chat');
const { verifyUser } = require('../authenticate');
const cors = require('../cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        return cb(null , 'public/images/profilepicture');
    },
    filename: (req,file,cb) => {
        return cb(null,uuidv4() + path.extname(file.originalname))
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

const roomRouter = express.Router()

roomRouter.options('/' , cors.cors , (req,res,next) => {res.sendStatus("200")});
roomRouter.get('/' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    console.log(req.query)
    console.log(mongoose.isValidObjectId(req.query.user))
    let query
    if(req.query.contact){
        query = {group: true , members: req.query.user}
        fields = 'groupDP name members'
    }else{
        query = {members: req.query.user}
        fields = ''
    }
    Rooms.find(query , fields)
    // .populate('chats')
    .populate('members')
    .then(rooms => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true , status:"Fetch Request For Rooms Successfull" ,rooms:rooms});
    } , err => next(err))
    .catch(err => console.log(err));
})
roomRouter.post('/' , cors.corsWithOpts , verifyUser , upload.single('groupDP') , (req,res,next) => {
    const arr = req.body.members.split(',')
    const doc = {
        name: req.body.name,
        description: req.body.description,
        admin: req.user._id,
        members: arr
    }
    if(req.file){
        doc.groupDP = req.file.filename
    }
    console.log(doc)
    Rooms.create(doc)
    .then(room => {
        if(!room){
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({success: false , status: "Room Creation Failed !!"});
        }else{
            Chats.create({ roomId: room._id })
            .then(chat => {
                room.chats = chat._id;
                room.save()
                .then(room => {
                    Rooms.findById(room._id)
                    .populate('members')
                    .then(room => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json({success: true ,status: "Room Created!!" , room:room});
                    })
                } , err=>next(err))
            } , err=> next(err))
        }
    }, err => next(err))
    .catch(err => console.log(err));
})

roomRouter.options('/createChat' , cors.cors , (req,res,next) => {res.sendStatus("200")});
roomRouter.post('/createChat' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    Rooms.findOne({group:false , members:{$size:2 , $all:req.body.members}} , (err,room) => {
        if(err){
            console.log(err)
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Chat Creation Failed!!" , err:err})
        }else if(room){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Chat Already Exists!!" , err:"Room Already Exists" , room:room})
        }else{
            console.log(req.body);
            Rooms.create(req.body)
            .then(room => {
                if(!room){
                    res.statusCode = 403;
                    res.setHeader('Content-Type','application/json');
                    res.json({success: false , status: "Room Creation Failed !!"});
                }else{
                    Chats.create({ roomId: room._id })
                    .then(chat => {
                        room.chats = chat._id;
                        room.save()
                        .then(room => {
                            Rooms.findById(room._id)
                            .populate('members')
                            .then(room => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json({success: true ,status: "Room Created!!" , room:room});
                            })
                        } , err=>next(err))
                    } , err=> next(err))
                    // Users.updateMany({_id: {$in:room.members}},
                    //     {$addToSet: {contacts: {$each: [room.members]} } })
                    // .then(contact => {
                    //     console.log(contact)
                    // } , err => console.log(err))
                    // .catch(err => console.log(err))
                }
            }, err => next(err))
            .catch(err => console.log(err));
        }
    })
})

roomRouter.options('/:roomId' , cors.cors , (req,res,next) => {res.sendStatus("200")});
roomRouter.get('/:roomId' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    console.log(req.params)
    Rooms.findById(req.params.roomId)
    .then(room => {
        if(!room){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Room-" + req.params.roomId + " not found !!"})
        }else{
            Rooms.findById(room._id)
            // .populate('chats')
            .populate('members')
            .then(room => {
                console.log(room)
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(room);
            } , err=> next(err))
            .catch(err => console.log(err));
        }
    } , err => next(err))
    .catch(err => console.log(err));
})
roomRouter.put('/:roomId' , (req,res,next) => {
    Rooms.findById(req.params.roomId)
    .then(room => {
        if(!room){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Room-" + req.params.roomId + " not found !!"})
        }else{
            if(req.body.name){
                room.name = req.body.name;
            }
            if(req.body.members){
                room.members = [...room.members , ...req.body.members];
            }
            room.save()
            .then(room => {
                Rooms.findById(room._id)
                .populate('members')
                .populate('chats')
                .then(room => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(room);
                },err => next(err));
            }, err => next(err))
            .catch(err => console.log(err));
        }
    } , err => next(err))
    .catch(err => console.log(err));
})
roomRouter.delete('/:roomId' , (req,res,next) => {
    Rooms.findByIdAndDelete(req.params.roomId)
    .then(resp => {
        if(!resp){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Room Not Found !!"});
        }else{
            Chats.deleteMany({roomId: req.params.roomId})
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({room: resp , chats: response});
            }, err => next(err))
            .catch(err => console.log(err))
            
        }
    } , err=> next(err))
    .catch(err => console.log(err));
})

roomRouter.post('/:roomId/chat' , (req,res,next) =>{
    Rooms.findById(req.params.roomId)
    .then(room => {
        if(!room){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Room-" + req.params.roomId + " not found !!"})
        }else{
            Chats.create(req.body)
            .then(chat => {
                if(!chat){
                    res.statusCode = 403;
                    res.setHeader('Content-Type','application/json');
                    res.json({status: false , msg: "Chat Creation Failed !!"});
                }else{
                    room.chats = [...room.chats , chat._id];
                    room.save()
                    .then(room => {
                        Rooms.findById(room._id)
                        .populate('members')
                        .populate('chats')
                        .then(room => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(room);
                        },err => next(err));
                    }, err => next(err))
                    .catch(err => console.log(err));
                }
            } , err => next(err))
            .catch(err => console.log(err)); 
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

module.exports = roomRouter;