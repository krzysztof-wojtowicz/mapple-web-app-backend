// user routes
const express = require('express')

// controller func
const { signupUser, loginUser, getUsers, deleteUser, editUser, getSingleUser, getUsersFromArray, addFollower, addFollowing, removeFollower, removeFollowing, verifyMail, sendMail } = require('../controllers/userController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

// verify route
router.get('/verify/:token', verifyMail)

// send again route
router.get('/send/:email', sendMail)

// auth for user routes 
router.use(requireAuth)

// GET all users from array
router.get('/array/:array', getUsersFromArray)

// GET all users
router.get('/', getUsers)

// GET single user
router.get('/:id', getSingleUser)

// DELETE user
router.delete('/:id', deleteUser)

// PATCH add follower
router.patch('/add/follower/:user_id', addFollower)

// PATCH add following
router.patch('/add/following/:user_id', addFollowing)

// PATCH remove follower
router.patch('/remove/follower/:user_id', removeFollower)

// PATCH remove following
router.patch('/remove/following/:user_id', removeFollowing)

// PATCH edit user
router.patch('/:id', editUser)

module.exports = router