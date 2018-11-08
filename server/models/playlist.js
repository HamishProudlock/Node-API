//DEPENDENCIES
import mongoose from 'mongoose';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE PLAYLIST'S SCHEMA
const PlaylistSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    maxlength: [70, 'Playlist titles have to be 70 characters or less.']
  },
  creator: {
    type: String,
    index: true,
    required: true
  },
  REFposts: [{
    creator: String,
    title: String,
    song: String,
    image: String

  }],
  private: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});
//CREATE COMPOUND INDEX FOR CREATOR AND ISDELETED
PlaylistSchema.index({ creator: -1, isDeleted: -1 });
//CREATE MODEL
const Playlist = mongoose.model('Playlist', PlaylistSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default Playlist
