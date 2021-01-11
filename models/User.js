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
    follows: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        }
    ],
    polls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Poll"
        }
    ]
})

module.exports = mongoose.model("User",userSchema);