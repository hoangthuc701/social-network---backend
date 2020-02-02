require('dotenv').config();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); //protect routes
const User = require('./../models/user');
const _ = require('lodash');
const { sendEmail } = require("../helpers");


exports.signup =  async (req,res)=>{
    const userExits =  await User.findOne({email: req.body.email })
    if (userExits) return res.status(403).json({
        error: "Email is token."
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({message:"Signup success!! Please login"});
}


exports.signin = (req,res)=>{
    //find the user base on email
    const {email,password} = req.body;
    User.findOne({email: email}, (err,user)=>{
        //if error or no user 
         if (err || !user){
             return res.status(401).json({
                 error:"User with that email isn't exits. Please signin again."
             });
         }

         //if user is found make sure the email and password match
         //create authenticate method in model and user here 
         if (!user.authenticate(password)){
             return res.status(401).json({
                error:"Email and password do not match."
             });
         }
        //if error or no user 
        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET);
        //if user authenticate
        //generate a token with user id and secret

        //persist the token as 't' in cookie with expiry date
        res.cookie("t",token,{expire: new Date() + 9999});
        //return respone with user and token to frontend  client
        const {_id,name,email, role} = user;
        return res.json({
            token, 
            user:{_id, email, name,role}
        }) 
    })
}
exports.signout = (req,res)=>{
    res.clearCookie("t"); 
    return res.status(200).json({
        message: "Signout success!"
    });
}
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty:"auth"
})
exports.forgotPassword = (req,res)=>{
    if (!req.body) return res.status(400).json({error:"No request body."});
    if (!req.body.email) return res.status(400).json({error:"No email in request body."});
    const {email} = req.body;
    User.findOne({email}, (err,user)=>{
        //console.log(user);        
        //if error or no user found
        if (err||!user) return res.status(401).json({error:"User with that email is not exist!"});
        //generate a token with user id and secret
        const token = jwt.sign({_id: user._id, iss:"NODEAPI"}, process.env.JWT_SECRET);
        //email data
        const emailData={
            from:"hoangthuc2106@gmail.com",
            to: email,
            subject:"Password reset Instructions",
            text:`Please use this following link to reset your password: 
            ${process.env.CLIENT_URL}/reset-password/${token}`,
            html:`<p>Please use the following link to reset your password:</p> 
            <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`
        };
        return user.updateOne({resetPasswordLink: token}, (err, success)=>{
            if (err){
                return res.status(400).json({message:err});
            }
            else
            {
                sendEmail(emailData);
                return res.status(200).json({
                    message:`Email has been sent to ${email}. Follow the instruction to reset your password.` 
                })
            }
        })
    })
}
exports.resetPassword = (req,res)=>{
    const {resetPasswordLink, newPassword} = req.body;
    User.findOne({resetPasswordLink}, (err, user)=>{
        if (err||!user) return res.status(400).json({error:"Invalid Link."});
        const updateFields ={
            password: newPassword,
            resetPassword:""
        }
        user = _.extend(user,updateFields);
        user.updated = Date.now();
        user.save((err,result)=>{
            if (err){
                return res.status(400).json({error:err})
            }
            res.json({
                message:"Great! Now you can login with new password."
            })
        })
    })
}
exports.socialLogin = (req,res)=>{
    let user = User.findOne({email: req.body.email},(err,user)=>{
        if (err) return res.status(400).json({error:err});
        if (!user){
            user = new User(req.body);
            req.profile =user;
            user.save();
            //generate token wit user id and secret
            const token = jwt.sign({_id:user._id, iss:"NODEAPI"}, process.env.JWT_SECRET);
            res.cookie("t",token,{ expire: new Date() + 9999 });
            const {_id,name,email}= user;
            res.json({_id,name,email});
        }
        else 
        {
            // update existing user with new social info and login
            req.profile = user;
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
    })
}