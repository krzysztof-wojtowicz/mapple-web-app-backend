// post model mongoDB

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    description: {
        type: String
    },
    user_id: {
        type: String,
        required: true
    },
    likedBy: [String],
    comments: [
        {
            type: new Schema(
                {
                    user_id: String,
                    content: String
                },
                { timestamps: true}
            )
        }
    ],
    runType: {
        type: String
    },
    livelox: {
        type: String
    },
    winsplits: {
        type: String
    },
    results: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)