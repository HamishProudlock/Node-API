//DEPENDENCIES
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE USER'S SCHEMA
const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    unique: true,
    required: [true, "Username field cannot be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
    maxlength: [15, 'Usernames must be 15 character or less long.']
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email field cannot be blank"],
    match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Email is invalid.'],
    index: true
  },
  password: {
    type: String,
    required: [true, "Password field cannot be blank"],
    minlength: [8, 'Password has to be at least 8 characters']
  },
  bio: {
    type: String,
    maxlength: [160, 'Bios can only be a maximum of 160 characters long'],
    default: 'Willkommen'
  },
  firstname: {
    type: String,
    required: [true, "Firstname field cannot be blank"],
    maxlength: [15, 'Must be 15 character or less long.'],
    match: [/^[a-zA-Z0-9 "!?.-]+$/, 'Firstname is invalid']
  },
  profilename: {
    type: String,
    maxlength: [15, 'Must be 15 character or less long.'],
    match: [/^[a-zA-Z0-9 "!?.-]+$/, 'is invalid']
  },
  avatar: {
    type: String,
    default: `${process.env.BASE_CLOUDINARY_URL}image/upload/v1531919488/Fuzzel_1/Profile_Pictures/default_avatar_picture.jpg`
  },
  coverPicture: {
    type: String,
    default: `${process.env.BASE_CLOUDINARY_URL}image/upload/v1531922668/Fuzzel_1/Cover_Pictures/default_cover_picture.jpg`
  },
  REFgenres: [{
    type: String
  }],
  followers: [{
    type: String
  }],
  following: [{
    type: String
  }],
  numberOfFollowers: {
    type: Number,
    default: 0
  },
  numberOfFollowing: {
    type: Number,
    default: 0
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: String,
    default: undefined
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})
//USE UNIQUE VALIDATOR
UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
//CREATE COMPOUND INDEX FOR USERNAME AND ISDELETED
UserSchema.index({ username: -1, isDeleted: -1 });
//DEFINE MODEL
const User = mongoose.model('User', UserSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default User
