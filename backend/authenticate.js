const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

const Users = require('./models/user');

module.exports.localPassport = passport.use(new localStrategy(Users.authenticate()));

module.exports.getJWT = (jwt_payload) => {
    return jwt.sign({_id: jwt_payload} , config.SECRET_KEY , {expiresIn:3600});
}

module.exports.verifyToken = (token) => {
    return jwt.verify(token , config.SECRET_KEY)
}

const opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRET_KEY;
passport.use(new jwtStrategy(opts,(jwt_payload,done) => {
    Users.findById(jwt_payload._id , (err,user) => {
        if(err){
            return done(err,false)
        }else if(!user){
            return done(null,false)
        }else if(user){
            return done(null,user)
        }
    })
}));
module.exports.verifyUser = passport.authenticate('jwt',{session:false});