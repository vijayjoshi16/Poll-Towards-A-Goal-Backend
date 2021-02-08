const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
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
    polls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrganizationPoll"
        }
    ]
});

module.exports = mongoose.model("Organization",organizationSchema);