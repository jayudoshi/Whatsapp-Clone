const express = require('express');
const Chats = require('../models/chat');
const config = require('../config');
const cors = require('../cors');
const {verifyUser} = require('../authenticate')
const chatRouter = express.Router()


chatRouter.get('/' , (req,res,next) => {
    Chats.find(req.query)
    .then(chats => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(chats)
    } , err => next(err))
    .catch(err => console.log(err));
});

// chatRouter.post('/' , (req,res,next) => {
//     Chats.create(req.body)
//     .then(chat => {
//         if(!chat){
//             res.statusCode = 403;
//             res.setHeader('Content-Type','application/json');
//             res.json({status: false , msg: "Chat Creation Failed !!"});
//         }else{
//             Chats.findById(chat._id)
//             .then(chat => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type','application/json');
//                 res.json(chat);
//             } , err => next(err))
//             .catch(err => console.log(err));
//         }
//     } , err => next(err))
//     .catch(err => console.log(err));
// });


chatRouter.options('/:chatId' , cors.cors , (req,res,next) => {res.sendStatus('200')});
chatRouter.get('/:chatId' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    Chats.findById(req.params.chatId)
    .populate({
        path:'chats',
        populate: {path:'from' , select:'name'}
    })
    .then(chat => {
        if(!chat){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Chat-" + req.params.chatId + " not found !!"})
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            console.log(chat)
            res.json(chat);
        }
    } , err => next(err))
    .catch(err => console.log(err));
});

chatRouter.put('/:chatId', cors.corsWithOpts , verifyUser , (req,res,next) => {
    Chats.findById(req.params.chatId)
    .then(chat => {
        if(!chat){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Chat-" + req.params.chatId + " not found !!"})
        }else{
            chat.chats.push(req.body)
            console.log(chat)
            chat.save()
            .then(chat => {
                console.log(chat)
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(chat);
            } , err => next(err))
            .catch(err => console.log(err));
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

chatRouter.delete('/:chatId' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    Chats.findByIdAndDelete(req.params.chatId)
    .then(resp => {
        if(!resp){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({status: false , msg: "Chat Not Found !!"});
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        }
    } , err=> next(err))
    .catch(err => console.log(err));
});

module.exports = chatRouter;