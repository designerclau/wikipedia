//Database schema
const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    tags:{
        type: Array(),
        required:true
    }
});

module.exports = mongoose.model('Films',PostSchema);