const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const PersonalPoll = require('../models/PersonalPoll');
const OrganizationPoll = require('../models/OrganizationPoll');
const pollRouter = express.Router();

pollRouter.post(
    '/createpersonalpoll',
    expressAsyncHandler(async (req,res)=>{
        if(req.body.question!=""){
            if(req.body.options.length){
                const poll = new PersonalPoll({
                    question: req.body.question,
                    options: req.body.options,
                    votes: [],
                    createdBy: req.body.createdBy
                });
                const savedPoll = await poll.save();
                res.status(200).send({message:"Success!",poll:poll});
            }else{
                res.status(401).send({message:"Please enter options!"});
            }
        }else{
            res.status(401).send({message:"Please enter a question!"});
        }
    })
)

pollRouter.post(
    '/createorganizationpoll',
    expressAsyncHandler(async (req,res)=>{
        if(req.body.question!=""){
            if(req.body.options.length){
                const poll = new OrganizationPoll({
                    question: req.body.question,
                    options: req.body.options,
                    votes: [],
                    createdBy: req.body.createdBy
                });
                const savedPoll = await poll.save();
                res.status(200).send({message:"Success!",poll:poll});
            }else{
                res.status(401).send({message:"Please enter options!"});
            }
        }else{
            res.status(401).send({message:"Please enter a question!"});
        }
    })
)

pollRouter.get(
    '/organization/getallpolls',
    expressAsyncHandler(async (req,res)=>{
        const allPolls = await OrganizationPoll.find({});
        return res.status(200).send({polls: allPolls});
    })
);

pollRouter.get(
    '/personal/getallpolls',
    expressAsyncHandler(async (req,res)=>{
        const allPolls = await PersonalPoll.find({});
        return res.status(200).send({polls: allPolls});
    })
);

pollRouter.get(
    '/organization/:id',
    expressAsyncHandler(async (req,res)=>{
        const poll = await OrganizationPoll.findById(req.params.id);
        if(poll){
            return res.status(200).send({message:"Success",poll: poll});
        }
        return res.status(404).send({message:"Could not find the requested resource"});
    })
);

pollRouter.get(
    '/personal/:id',
    expressAsyncHandler(async (req,res)=>{
        const poll = await PersonalPoll.findById(req.params.id);
        if(poll){
            return res.status(200).send({message:"Success",poll: poll});
        }
        return res.status(404).send({message:"Could not find the requested resource"});
    })
);

module.exports = pollRouter;