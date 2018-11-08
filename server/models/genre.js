//DEPENDENCIES
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE GENRE'S SCHEMA
const GenreSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    maxlength: [70, 'Titles must be 70 characters or less.'],
    match: [/^[^<>!"£$%^&*()@'#~.,=+{}\/`¬?;:]*$/, 'is invalid'],
    index: true,
    unique: true
  },
  pagePicture: {
    type: String,
    default: `${process.env.BASEAWSURL}image/upload/v1532188817/Fuzzel_1/Genre_Page_Pictures/default_page_picture.jpg`
  },
  coverPicture: {
    type: String,
    default: `${process.env.BASE_CLOUDINARY_URL}image/upload/v1531922668/Fuzzel_1/Genre_Cover_Pictures/default_cover_picture.jpg`
  },
  explanation: {
    type: String,
    maxlength: [999, 'Page explanations must be 999 characters or less.'],
    default: 'Welcome to my new page'
  },
  admins: [{
    type: String
  }],
  bannedAccounts: [{
    type: String
  }],
  REFusers: [{
    type: String
  }],
  numberOfUsers: {
    type: Number,
    default: 0
  },
}, {timestamps: true});
//USE UNIQUE VALIDATOR
GenreSchema.plugin(uniqueValidator, {message: 'is already taken.'});
//DEFINE MODEL
const Genre = mongoose.model('Genre', GenreSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default Genre
