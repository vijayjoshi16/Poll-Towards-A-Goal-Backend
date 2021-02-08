const express = require('express');
const organizationRouter = express.Router();
const expressAsyncHandler = require('express-async-handler');
const Organization = require('../models/Organization');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

organizationRouter.post(
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

organizationRouter.post(
    '/signin',
    expressAsyncHandler(async (req,res)=>{
        const organization = await Organization.findOne({
            email: req.body.email
        });
        if(organization){
            if( bcrypt.compareSync(req.body.password, organization.password)){
                const token = jwt.sign({_id: organization._id},process.env.JWT_SECRET);
                return res.status(200).send({
                    token: token,
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

organizationRouter.get(
    '/:id',
    expressAsyncHandler(async (req,res)=>{
        try{
        const organization = await Organization.findById(req.params.id).populate('polls','question options votes');
        if(organization)
        return res.status(200).send({message:"Success",organization: organization});
        else
        return res.status(404).send({message:"Could not find the requested resource"});
        }catch{
            return res.status(500).send({message:"Internal server error"});
        }
    }))

module.exports = organizationRouter;
