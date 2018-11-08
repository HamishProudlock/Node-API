//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const postVoteController = {};
//VOTE
postVoteController.vote = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.PostVote.find({ post: req.body.postId, creator: infoDecoded.username }).then(result => {
    if (result === null) {
      if(result.score === req.body.score) {
        res.status(200).json({
          message: "Post voted on."
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
          db.Post.findByIdAndUpdate(req.body.postId, { $inc: {score: increment}}).then(newerResult => {
            res.status(200).json({
              message: "Post voted on."
            })
          }).catch(err => {
            return res.status(500).json({
              "message": "y",
              error: err
            });
          })
        }).catch(err => {
          return res.status(500).json({
            "message": "z",
            error: err
          });
        })
      }
    }
    else {
      const PostVote = new db.PostVote({
        _id: new mongoose.Types.ObjectId(),
        creator: infoDecoded.username,
        post: req.body.postId,
        score: req.body.score,
      })
      console.log(req.body.score)
      PostVote.save().then(result => {
        var increment = 0
        if (req.body.score === 3) {
         var increment = 1
         //console.log(increment)
         return increment
        }
        else if (req.body.score === 1) {
          var increment = -1
          return increment
        }
        else {
          var increment = 0
          //console.log(increment)
          return increment
        }
      /*  switch (req.body.score) {
          case 1:
             increment = -1
             break;
          case 3:
             increment = 1
             break;
          /*default:
             res.status(500).json({
               message: "An error occured"
             })
        }*/
        //console.log(increment)
        db.Post.findByIdAndUpdate(req.body.postId, { $inc: {score: increment}}).then(newerResult => {
          res.status(200).json({
            message: "Post voted on."
          })
        }).catch(err => {
          return res.status(500).json({
            "message": "a",
            error: err
          });
        })
      }).catch(err => {
        console.log(err);
        return res.status(500).json({
          "message": "c",
          error: err
        });
      })
    }
  }).catch(err => {
    console.log(err);
    return res.status(500).json({
      "message": "b",
      error: err
    });
  })
}
//EXPORT CONTROLLERS
export default postVoteController
