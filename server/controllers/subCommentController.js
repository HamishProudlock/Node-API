//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//GET PROMISES TO WORK
mongoose.Promise = global.Promise;
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const subCommentController = {};
//CREATE SUBCOMMENT
subCommentController.createSubComment = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  const SubComment = new db.SubComment({
    _id: new mongoose.Types.ObjectId(),
    comment: req.body.comment,
    creator: infoDecoded.username,
    REFcomment: req.body.commentId
  })
  SubComment.save().then(result => {
    return res.status(201).json({
      message: "comment successfully created!",
    });
  }).catch(err => {
    res.status(500).json({
      issue: "Unable to create comment",
      error: err
    });
  })
};
//DELETE SUBCOMMENT
subCommentController.deleteSubComment =  (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.SubComment.findOneAndUpdate({
    _id: req.body.subCommentId,
    creator: infoDecoded.username
  }, {isDeleted: true}).then(result => {
    if(result) {
      return res.status(200).json({
        message: "comment successfully deleted."
      })
    }
    else {
      return res.status(500).json({
        message: "You can only delete your own comments"
      });
    }
  }).catch(err => {
    return res.status(500).json({
      error: err
    });
  })
}
//UPDATE SUBCOMMENT
subCommentController.updateSubComment =  (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.SubComment.findOneAndUpdate({
    _id: req.body.subCommentId,
    creator: infoDecoded.username
  }, {comment: req.body.comment, isUpdated: true}).then(result => {
    if(result) {
      return res.status(200).json({
        message: "comment successfully updated."
      })
    }
    else {
      return res.status(500).json({
        message: "You can only update your own comments"
      });
    }
  }).catch(err => {
    return res.status(500).json({
      error: err
    });
  })
}
//GET SUBCOMMENTS
subCommentController.getSubComments = (req, res, next) => {
  if(req.body.lastdate === undefined) {
    db.SubComment.find({isDeleted: false, REFcomment: req.body.commentId}).sort({ createdAt: -1 }).limit(100).then(results => {
      return res.status(200).json({
        message: "success",
        data: results
      })
    }).catch(err => {
        return res.status(500).json({
          issue: "Unable to find any posts for this user.",
          error: err
        })
      })
    }
  else {
    db.Post.find({isDeleted: false, createdAt: { $lt: req.body.lastdate}, REFcomment}).sort({ createdAt: -1 }).limit(100).then(results => {
      return res.status(200).json({
        message: "success",
        data: results
      })
    }).catch(err => {
        return res.status(500).json({
          issue: "Unable to find any posts for this user.",
          error: err
        })
      })
  }
}
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
export default subCommentController
