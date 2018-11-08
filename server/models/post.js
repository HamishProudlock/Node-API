//DEPENDENCIES
import mongoose from 'mongoose';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE POST'S SCHEMA
const PostSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    maxlength: [70, 'Music titles have to be 70 characters or less.'],
    match: [/^[^<>!"£$%^&*()'#~.,=+{}\/`¬?;:]*$/, 'is invalid'],
  },
  song: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: `${process.env.BASE_CLOUDINARY_URL}image/upload/v1532356859/Fuzzel_1/Song_Pictures/default_song_picture.jpg`
  },
  score: {
    type: Number,
    default: 0
  },
  genre: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});
//SET UP COMPOUND INDEXES
PostSchema.index({ isDeleted: 1, score: -1, createdAt: -1, genre: 1 });
PostSchema.index({ isDeleted: 1, createdAt: -1, creator: 1 })
//DEFINE MODEL
const Post = mongoose.model('Post', PostSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default Post
