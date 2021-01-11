const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
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
    pollType:{
        type: "String"
    }
})

module.exports = mongoose.model("Poll",pollSchema);