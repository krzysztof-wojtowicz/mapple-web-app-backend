// user controller
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const cloudinary = require("../utils/cloudinary");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET);
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    const _id = user._id;
    const url = user.profile_picture.url;
    const followers = user.followers;
    const following = user.following;

    res.status(200).json({ _id, email, token, url, followers, following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    const user = await User.singup(name, surname, email, password);

    // create a token
    const token = createToken(user._id);

    const _id = user._id;
    const url = user.profile_picture.url;
    const followers = user.followers;
    const following = user.following;

    res.status(200).json({ _id, email, token, url, followers, following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all users
const getUsers = async (req, res) => {
  const users = await User.find({}).sort();

  res.status(200).json(users);
};

// get single user
const getSingleUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(344).json({ error: "No such user" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(305).json({ error: "No such user" });
  }
  res.status(200).json(user);
};

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  if (
    user.profile_picture.public_id !== "profile_pictures/default_avatar_rmhq6j"
  ) {
    await cloudinary.uploader.destroy(user.profile_picture.public_id);
  }

  res.status(200).json(user);
};

// edit user
const editUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const { name, surname, bio, image_url, currentImageId } = req.body;

  const result =
    typeof image_url === "object"
      ? { public_id: image_url.public_id, secure_url: image_url.url }
      : await cloudinary.uploader.upload(image_url, {
          folder: "profile_pictures",
        });

  if (
    !(typeof image_url === "object") &&
    currentImageId !== "profile_pictures/default_avatar_rmhq6j"
  ) {
    await cloudinary.uploader.destroy(currentImageId);
  }

  const user = await User.findByIdAndUpdate(
    { _id: id },
    {
      name,
      surname,
      bio,
      profile_picture: { public_id: result.public_id, url: result.secure_url },
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// get users from array
const getUsersFromArray = async (req, res) => {
  let { array } = req.params;

  array = array.replace("}", "").replace("{", "").split(",");

  array.forEach((element) => {
    if (!mongoose.Types.ObjectId.isValid(element)) {
      return res.status(404).json({ error: "No such user" });
    }
  });

  const users = await User.find({ _id: { $in: array } }).sort();

  if (!users) {
    return res.status(404).json({ error: "No such user" });
  }

  res.status(200).json(users);
};

// add follower
const addFollower = async (req, res) => {
  const { user_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const { newFollower } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: user_id },
    {
      $push: { followers: newFollower },
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// add following
const addFollowing = async (req, res) => {
  const { user_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const { newFollowing } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: user_id },
    {
      $push: { following: newFollowing },
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// remove follower
const removeFollower = async (req, res) => {
  const { user_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const { newFollower } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: user_id },
    {
      $pull: { followers: newFollower },
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// remove following
const removeFollowing = async (req, res) => {
  const { user_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const { newFollowing } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: user_id },
    {
      $pull: { following: newFollowing },
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// verify mail
const verifyMail = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.params.token, process.env.MAIL_SECRET);
    console.log(_id);
    const user = await User.findOneAndUpdate(
      { _id },
      {
        verified: true,
      }
    );
  } catch (e) {
    res.send("error");
    console.log("error");
  }

  return res.redirect(`${process.env.PAGE_URL}/login`);
};

// send mail again
const sendMail = async (req, res) => {
  const { email } = req.params;

  const user = await User.find({ email: email });

  await User.send(user[0]);

  res.status(200).json({ msg: "Mail sent again" });
};

module.exports = {
  loginUser,
  signupUser,
  getUsers,
  deleteUser,
  editUser,
  getSingleUser,
  getUsersFromArray,
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing,
  verifyMail,
  sendMail,
};
