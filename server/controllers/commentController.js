//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//GET PROMISES TO WORK
mongoose.Promise = global.Promise;
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const commentController = {};
//CREATE COMMENT
commentController.createComment = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  const Comment = new db.Comment({
    _id: new mongoose.Types.ObjectId(),
    comment: req.body.comment,
    creator: infoDecoded.username,
    REFposts: req.body.postId
  })
  Comment.save().then(result => {
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
//DELETE COMMENT
commentController.deleteComment =  (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Comment.findOneAndUpdate({
    _id: req.body.commentId,
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
//UPDATE COMMENT
commentController.updateComment =  (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Comment.findOneAndUpdate({
    _id: req.body.commentId,
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
//GET COMMENTS FOR A POST
commentController.getAll = (req, res, next) => {
  if(req.body.lastScore === undefined) {
    db.Comment.find({ isDeleted: false, REFposts: req.body.postId}).sort({Score: -1, createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({
        message: "success",
        data: results
      })
    }).catch(err => {
      return res.status(500).json({
        issue: "Unable to find any comments.",
        error: err
      })
    })
  }
  else {
    db.Comment.find({isDeleted: false, Score: req.body.lastScore, createdAt: {$lte: req.body.lastDate}, REFposts: req.body.postId}).sort({Score: -1, createdAt: -1}).limit(100).then(results => {
      const extra = results.length
      if (extra === 100) {
        return res.status(200).json({
          message: "success",
          data: results
        })
      }
      else {
        db.Post.find({isDeleted: false, Score: { $lt: req.body.lastScore }, REFposts: req.body.postId}).sort({Score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
          const data = results.concat(secondResults)
          return res.status(200).json({
            message: "success",
            data: data
          })
        }).catch(err => {
          return res.status(500).json({
            issue: "Unable to find any comments.",
            error: err
          })
        })
      }
    }).catch(err => {
      return res.status(500).json({
        issue: "Unable to find any comments.",
        error: err
      })
    })
  }
}
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
export default commentController
