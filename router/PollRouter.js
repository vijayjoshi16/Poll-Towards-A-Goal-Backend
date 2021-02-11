const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const PersonalPoll = require('../models/PersonalPoll');
const OrganizationPoll = require('../models/OrganizationPoll');
const Organization = require('../models/Organization');
const pollRouter = express.Router();
const User = require('../models/User');

pollRouter.post(
    '/createpersonalpoll',
    expressAsyncHandler(async (req,res)=>{
        if(req.body.question!=""){
            console.log(req.body)
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
                const updateOrganization = await Organization.updateOne({_id:req.body.createdBy},
                    {$push: {polls: poll._id}});
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
        const allPolls = await OrganizationPoll.find({}).populate('createdBy','_id name pic');
        return res.status(200).send({polls: allPolls});
    })
);

pollRouter.get(
    '/personal/getallpolls',
    expressAsyncHandler(async (req,res)=>{
        const allPolls = await PersonalPoll.find({}).populate('createdBy','_id name pic');
        return res.status(200).send({polls: allPolls});
    })
);

pollRouter.get(
    '/organization/:id',
    expressAsyncHandler(async (req,res)=>{
        const poll = await OrganizationPoll.findById(req.params.id).populate('createdBy','name');
        if(poll){
            return res.status(200).send({message:"Success",poll: poll});
        }
        return res.status(404).send({message:"Could not find the requested resource"});
    })
);

pollRouter.get(
    '/personal/:id',
    expressAsyncHandler(async (req,res)=>{
        const poll = await PersonalPoll.findById(req.params.id).populate('createdBy','name');
        if(poll){
            return res.status(200).send({message:"Success",poll: poll});
        }
        return res.status(404).send({message:"Could not find the requested resource"});
    })
);

pollRouter.post(
    '/personal/vote/:id',
    expressAsyncHandler(async (req,res)=>{
        try{
            const poll = await PersonalPoll.findById(req.params.id);
            if(poll){
                const userId = req.body.userId;
                const option = req.body.option;
                const userData = await User.findById(userId);
                if(userData.votedToPersonal.includes(req.params.id))
                return res.status(200).send({message:"Already voted for this poll"});
                userData.votedToPersonal.push(req.params.id);
                poll.votes.push({
                    votedBy: userId,
                    option: option
                });
                const updatedUser = await User.updateOne({_id:userId},{votedToPersonal:userData.votedToPersonal});
                const updatedPoll = await PersonalPoll.updateOne({_id:req.params.id},{votes:poll.votes});
                return res.status(200).send({user:updatedUser,poll:updatedPoll});
            }
            return res.status(404).send({message:"Could not find the requested resource"});
        }catch(err){
            console.log(err)
            return res.status(500).send({message:"Internal server error"})
        }
    })
)

pollRouter.post(
    '/organization/vote/:id',
    expressAsyncHandler(async (req,res)=>{
        try{
            const poll = await OrganizationPoll.findById(req.params.id);
            if(poll){
                const userId = req.body.userId;
                const option = req.body.option;
                const userData = await User.findById(userId);
                if(userData.votedToOrganization.includes(req.params.id))
                return res.status(200).send({message:"Already voted for this poll"});
                userData.votedToOrganization.push(req.params.id);
                poll.votes.push({
                    votedBy: userId,
                    option: option
                });
                const updatedUser = await User.updateOne({_id:userId},{votedToOrganization:userData.votedToOrganization});
                const updatedPoll = await OrganizationPoll.updateOne({_id:req.params.id},{votes:poll.votes});
                return res.status(200).send({user:updatedUser,poll:updatedPoll});
            }
            return res.status(404).send({message:"Could not find the requested resource"});
        }catch(err){
            console.log(err)
            return res.status(500).send({message:"Internal server error"})
        }
    })
)

module.exports = pollRouter;