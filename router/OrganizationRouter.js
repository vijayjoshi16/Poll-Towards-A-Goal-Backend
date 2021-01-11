const express = require('express');
const orgaizationRouter = express.Router();
const expressAsyncHandler = require('express-async-handler');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

orgaizationRouter.post(
    '/signup',
    expressAsyncHandler(async (req,res)=>{
        const organization = await Organization.findOne({ email: req.body.email});
        if(!organization){
            const newOrganization = new Organization({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 9),
                pic: req.body.pic,
                polls: []
            });
            const savedOrganization = await newOrganization.save();
            return res.status(200).send({
                organization:{
                    name: savedOrganization.name,
                    email: savedOrganization.email,
                    pic: savedOrganization.pic,
                    follows: [],
                    polls: []
                },
                message: "Saved organization successfully!"
            })
        }else{
            return res.status(409).send({message:"Organization with that email already exists!"});
        }
    })
)

orgaizationRouter.post(
    '/signin',
    expressAsyncHandler(async (req,res)=>{
        const organization = await Organization.findOne({
            email: req.body.email
        });
        if(organization){
            if( bcrypt.compareSync(req.body.password, organization.password)){
                return res.status(200).send({
                    loggedInOrganization:{
                        name: organization.name,
                        email: organization.email,
                        pic: organization.pic,
                        follows: organization.follows,
                        polls: organization.polls
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

module.exports = orgaizationRouter;
