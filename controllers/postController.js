// post controller
const { default: mongoose } = require('mongoose');
const Post = require('../models/postModel');

const cloudinary = require('../utils/cloudinary')

//get all posts
const getPosts = async (req,res) => {
    const { limit, skip } = req.params
    
    const posts = await Post.find({}).sort({createdAt: -1}).skip(skip*limit).limit(limit)

    res.status(200).json(posts)
}

//get all user's posts
const getUserPosts = async(req,res) => {
    const { user_id, limit, skip } = req.params

    if(!mongoose.Types.ObjectId.isValid(user_id)){
        return res.status(404).json({error: 'No such post'})
    }

    const posts = await Post.find({user_id: user_id}).sort({createdAt: -1}).skip(skip*limit).limit(limit)

    if(!posts){
        return res.status(404).json({error: 'No such post'})
    }
    res.status(200).json(posts)
}

//get a single post
const getSinglePost = async(req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(344).json({error: 'No such post in database'})
    }
    const post = await Post.findById(id)

    if(!post){
        return res.status(305).json({error: 'No value for post'})
    }
    res.status(200).json(post)
}

//create new post
const createPost = async(req,res) => {
    const { title, description, image, user_id } = req.body

    //add doc to db
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts"
        })
        
        const post = await Post.create({
            title,
            image: { public_id: result.public_id, url: result.secure_url },
            description,
            user_id
        })

        res.status(200).json(post)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}
//delete a post
const deletePost = async(req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such post'})
    }

    const post = await Post.findOneAndDelete({_id: id})

    if(!post){
        return res.status(400).json({error: 'No such post'})
    }

    await cloudinary.uploader.destroy(post.image.public_id)

    res.status(200).json(post)

}

//update a post
const updatePost = async (req,res) => {
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such post'})
    }

    const post = await Post.findOneAndUpdate({_id: id},{
        ...req.body
    })

    if(!post){
        return res.status(400).json({error: 'No such post'})
    }

    res.status(200).json(post)
}

// add like
const addLike = async (req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such post'})
    }

    const { likedBy } = req.body

    const post = await Post.findOneAndUpdate({_id: id},{
        $push: { likedBy }
    })

    if(!post){
        return res.status(400).json({error: 'No such post'})
    }

    res.status(200).json(post)
}

// get posts from array
const getPostsArray = async (req,res) => {
    let { array, limit, skip } = req.params

    array = array.replace("}", "").replace("{", "").split(',')

    array.forEach((element) => {
        if(!mongoose.Types.ObjectId.isValid(element)){
            return res.status(404).json({error: 'No such user'})
        }
    })

    const posts = await Post.find({ user_id : { $in : array } }).sort({createdAt: -1}).skip(skip*limit).limit(limit)

    if(!posts){
        return res.status(404).json({error: 'No such post'})
    }

    res.status(200).json(posts)
}

// add comment
const addComment = async (req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such post'})
    }

    const { comment } = req.body

    // comment: { user_id: ididididi, content: akgagag}

    const post = await Post.findOneAndUpdate({_id: id},{
        $push: { comments: comment }
    }, { new : true })

    if(!post){
        return res.status(400).json({error: 'No such post'})
    }

    res.status(200).json(post)
}

module.exports = {
    getPosts,
    getSinglePost,
    createPost,
    deletePost,
    updatePost,
    getUserPosts,
    addLike,
    getPostsArray,
    addComment
}