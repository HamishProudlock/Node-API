//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const commentVoteController = {};
//VOTE
commentVoteController.vote = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.CommentVote.find({ comment: req.body.commentId, creator: infoDecoded.username }).then(result => {
    if (result) {
      if(result.score === req.body.score) {
        res.status(200).json({
          message: "Comment voted on."
        })
      }
      else {
        result.score = req.body.score
        result.save().then(newResult => {
          switch (req.body.score) {
            case 1:
               increment = -1
               break;
            case 3:
               increment = 1
               break;
            default:
               res.status(500).json({
                 message: "An error occured"
               })
          }
          db.Comment.findByIdAndUpdate(req.body.commentId, { $inc: {Score: increment}}).then(newerResult => {
            res.status(200).json({
              message: "Comment voted on."
            })
          }).catch(err => {
            return res.status(500).json({
              error: err
            });
          })
        }).catch(err => {
          return res.status(500).json({
            error: err
          });
        })
      }
    }
    else {
      const CommentVote = new db.commentVote({
        _id: new mongoose.Types.ObjectId(),
        creator: infoDecoded.username,
        comment: req.body.commentId,
        score: req.body.score,
      })
      CommentVote.save().then(result => {
        switch (req.body.score) {
          case 1:
             increment = -1
             break;
          case 3:
             increment = 1
             break;
          default:
             res.status(500).json({
               message: "An error occured"
             })
        }
        db.Comment.findByIdAndUpdate(req.body.commentId, { $inc: {Score: increment}}).then(newerResult => {
          res.status(200).json({
            message: "Comment voted on."
          })
        }).catch(err => {
          return res.status(500).json({
            error: err
          });
        })
      }).catch(err => {
        return res.status(500).json({
          error: err
        });
      })
    }
  }).catch(err => {
    return res.status(500).json({
      error: err
    });
  })
}
//EXPORT CONTROLLERS
export default commentVoteController
