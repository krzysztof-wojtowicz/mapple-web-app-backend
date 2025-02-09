// posts routes
const express = require('express')
//const Post = require('../models/postModel')
const {
    createPost,
    getSinglePost,
    getPosts,
    deletePost,
    updatePost,
    getUserPosts,
    addLike,
    getPostsArray,
    addComment
} = require('../controllers/postController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// auth for all post routes
router.use(requireAuth)

// GET all posts from user array
router.get('/array/:array/:limit/:skip', getPostsArray)

// GET single post
router.get('/single/:id', getSinglePost)

// GET all posts created by single user
router.get('/:user_id/:limit/:skip', getUserPosts)

// GET all posts
router.get('/:limit/:skip', getPosts)

// POST create post
router.post('/', createPost)

// DELETE post
router.delete('/:id', deletePost)

// PATCH edit post
router.patch('/:id', updatePost)

// PATCH add like
router.patch('/add/like/:id', addLike)

// PATCH add comment
router.patch('/add/comment/:id', addComment)

module.exports = router