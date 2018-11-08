//DEPENDENCIES
import mongoose from 'mongoose';
//GET SCHEMA FROM MONGOOSE
const { Schema } = mongoose;
//DEFINE COMMENT'S SCHEMA
const SubCommentSchema = new Schema({
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
  REFcomment: {
    type: String,
    required: true
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
SubCommentSchema.index({  isDeleted: 1, createdAt: -1, REFcomment: 1 });
//DEFINE MODEL
const SubComment = mongoose.model('SubComment', SubCommentSchema);
//EXPORT TO INDEX.JS AS TO BE USED BY IT'S CONTROLLER AND ELSEWHERE
export default SubComment
