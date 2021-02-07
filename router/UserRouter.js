const express = require('express');
const userRouter = express.Router();
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

userRouter.post(
    '/signup',
    expressAsyncHandler(async (req,res)=>{
        const user = await User.findOne({ email: req.body.email});
        console.log(req.body)
        if(!user){
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 9),
                pic: req.body.pic,
                follows: [],
                polls: []
            });
            const savedUser = await newUser.save();
            return res.status(200).send({
                user:{
                    name: savedUser.name,
                    email: savedUser.email,
                    pic: savedUser.pic,
                    follows: [],
                    polls: []
                },
                message: "Saved user successfully!"
            })
        }else{
            return res.status(409).send({message:"User with that email already exists!"});
        }
    })
)

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req,res)=>{
        const user = await User.findOne({
            email: req.body.email
        });
        if(user){
            if( bcrypt.compareSync(req.body.password, user.password)){
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
                return res.status(200).send({
                    token: token,
                    loggedInUser:{
                        name: user.name,
                        email: user.email,
                        pic: user.pic,
                        follows: user.follows,
                        polls: user.polls
                    },
                    message: "Logged in successfully!"
                })
            }else{
                return res.status(401).send({
                    message: "Invalid email or password!"
                })
            }
        }else{
            return res.status(401).send({
                message: "Invalid email or password!"
            })
        }
    })
)

module.exports = userRouter;