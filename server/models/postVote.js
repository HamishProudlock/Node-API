//DEPENDENCIES
import mongoose from 'mongoose';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE POST VOTING SCHEMA
const PostVoteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  creator: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 2,
    match: [/^(?:[1-2]|0[1-2]|3)$/, 'is invalid']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});
//DEFINE MODEL
const PostVote = mongoose.model('PostVote', PostVoteSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default PostVote
