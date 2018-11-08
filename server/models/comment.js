//DEPENDENCIES
import mongoose from 'mongoose';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE COMMENT'S SCHEMA
const CommentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  comment: {
    type: String,
    maxlength: [999, 'Comments must be 999 characters or less.'],
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  REFposts: {
    type: String,
    required: true
  },
  Score: {
    type: Number,
    default: 0,
  },
  isUpdated: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});
//SET UP COMPOUND INDEXES
CommentSchema.index({  isDeleted: 1, score: -1, createdAt: -1, REFposts: 1 });
//DEFINE MODEL
const Comment = mongoose.model('Comment', CommentSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default Comment
