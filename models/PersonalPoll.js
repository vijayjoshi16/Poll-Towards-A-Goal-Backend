const mongoose = require('mongoose');

const personalPollSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    options: [
        {
            optionContent: {
                type: String
            },
            optionIndex: {
                type: Number
            }
        }
    ],
    votes: [
        {
            votedBy:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            option:{
                type: Number
            }
        }
    ],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("PersonalPoll",personalPollSchema);