const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type: String
    },
    votedToPersonal:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"PersonalPoll"
        }
    ],
    votedToOrganization:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"OrganizationPoll"
        }
    ]
})

module.exports = mongoose.model("User",userSchema);