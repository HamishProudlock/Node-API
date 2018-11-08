//DEPENDENCIES
import bcrypt from 'bcrypt';
import db from './../models';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import promise from 'bluebird';
//GET PROMISES TO WORK
mongoose.Promise = global.Promise;
//CONFIGURE CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const userController = {};
//CREATE USER
userController.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: 'Unable to create new User',
        issue: err
      });
    } else {
      const User = new db.User({
        _id: new mongoose.Types.ObjectId(),
        username: `${req.body.username}`,
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        profilename: req.body.firstname,
      });
      User.save().then(result => {
        const token = jwt.sign({
          email: result.email,
          userId: result._id,
          username: result.username,
          createdAt: result.createdAt
        },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );
        console.log(result);
        res.status(201).json({
          message: `Welcome to Fuzzel ${result.username}!`,
          token: token
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
    }
  });
};
//LOGIN USER
userController.login = (req, res, next) => {
  db.User.findOne({ email: req.body.email }).then(User =>{
    if(!User) {
      return res.status(401).json({
        message: "Email or Password is incorrect."
      })
    }
    else {
      bcrypt.compare(req.body.password, User.password, (err, result) => {
        if (!result) {
          return res.status(404).json({
            error: true,
            message: "Email or Password is incorrect."
          });
        }
        else if (User.isDeleted === true) {
          db.User.findByIdAndUpdate(User._id, {isDeleted: false}).then(result =>{
            const token = jwt.sign({
              email: result.email,
              userId: result._id,
              username: result.username,
              createdAt: result.createdAt
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" });
            return res.status(200).json({
              message: "Welcome back! We missed you, we really did!",
              token: token
            });
          }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            })
          })
        }
        else {
          const token = jwt.sign({
            email: User.email,
            userId: User._id,
            username: User.username,
            avatar: `${process.env.BASE_CLOUDINARY_URL}image/upload/Fuzzel_1/Profile_Pictures/${User.username}_ProfilePic`
          },
          process.env.JWT_KEY,
          { expiresIn: "24h" });
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
      })
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
};
//GET USER
userController.getUser = (req, res, next) => {
  db.User.findOne(
    {
      username: req.params.username,
      isDeleted: false
    },
    '-_id -password -email -firstname -lastname -resetPasswordToken -resetPasswordExpires -following -followers'
  ).then((User) => {
    if(User === null){
      return res.status(500).json({
        error: "Unable to retrieve user's data",
        issue: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: User
      });
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({
      error: err,
      issue: "Unable to retrieve user's data"
    })
  });
};
//GET LOGGED IN USERNAME
userController.username = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  return res.status(200).json({
    success: true,
    data: infoDecoded.username
  })
}
//DELETE USER
userController.delete = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.User.findById(infoDecoded.userId, 'password').then(Password => {
    bcrypt.compare(req.body.password, Password.password, (err, result) => {
      if (!result) {
        return res.status(404).json({
          error: true,
          message: "Email or Password is incorrect."
        });
      }
      else {
        db.User.findByIdAndUpdate(infoDecoded.userId, {isDeleted: true}).then(
          user => {
            return res.status(200).json({
              success: "Account has been deleted.",
              data: user
          })
        }).catch(err => {
          return res.status(500).json({
            error: "Unable to delete user's account",
            issue: err
          })
        })
      }
    })
  }).catch(err => {
    return res.status(500).json({
      error: "Unable to delete user's account",
      issue: err
    })
  })
}
//UPDATE USER'S BIO AND PROFILE NAME
userController.update = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.User.findByIdAndUpdate(infoDecoded.userId, {
    bio: req.body.bio,
    profilename: req.body.profilename
  }).then(result => {
    console.log(result);
    return res.status(200).json({
      message: "User updated"
    });
  }).catch(err => {
    console.log(err);
    return res.status(500).json({
      error: 'Unable to update User',
      issue: err
    });
  });
};
//UPDATE PROFILE PICTURE
userController.newProfilePic = (req, res, next) => {
  const originalName = req.files.profilePicture.name
  if (/\.(jpg|jpeg|png|gif)$/.test(originalName)) {
    const jsonToken = req.headers.authorization.split(" ")[1];
    const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
    const filename = `Fuzzel_1/Profile_Pictures/${infoDecoded.username}_ProfilePic`
    cloudinary.v2.uploader.upload_stream({
      public_id: filename,
      invalidate: true
    },  function(error, result) {
        console.log(result, error);
        if(error){
          return res.status(500).json({
            error: 'Unable to change profile picture.',
            issue: error
          });
        }
        else {
          db.User.findByIdAndUpdate(infoDecoded.userId, {
            avatar: result.secure_url
          }).then(result => {
            console.log(result);
            res.status(200).json({
              message: "Profile picture updated."
            })
          }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: 'Unable to update profile picture.',
              issue: err
            });
          });
        }
      }).end(req.files.profilePicture.data)}
      else {
        res.status(500).json({
          error: 'Only image files are allowed.',
        });
      }
    }
//UPDATE COVER PICTURE
userController.newCoverPic = (req, res, next) => {
  const originalName = req.files.coverPicture.name
  if (/\.(jpg|jpeg|png|gif)$/.test(originalName)) {
    const jsonToken = req.headers.authorization.split(" ")[1];
    const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
    const filename = `Fuzzel_1/Cover_Pictures/${infoDecoded.username}_CoverPic`
    cloudinary.v2.uploader.upload_stream({ public_id: filename},  function(error, result) {
        console.log(result, error);
        if(error){
          res.status(500).json({
            error: 'Unable to change cover picture.',
            issue: err
          });
        }
        else {
          db.User.findByIdAndUpdate(infoDecoded.userId, {
            coverPicture: result.secure_url
          }).then(result => {
            console.log(result);
            res.status(200).json({
              message: "Cover picture updated."
            })
          }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: 'Unable to update cover picture.',
              issue: err
            });
          });
        }
      }).end(req.files.coverPicture.data)}
      else {
        return res.status(500).json({
          error: 'Only image files are allowed.',
        });
      }
    }
//FOLLOW OTHER USER
userController.follow = (req, res, next) => {
      const jsonToken = req.headers.authorization.split(" ")[1];
      const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
      db.User.findOneAndUpdate({
        "username": req.body.usernameToFollow,
        "isDeleted": false
      }, { $addToSet: { 'followers': infoDecoded.username}}, {new: true}, function(err, result) {
        if (err) { err => {
          console.log(err);
          res.status(500).json({
            error: 'Unable to follow user.',
            issue: err
          })
        }
      }
        else {
          const numberOfFollowers = result.followers.length;
          console.log(numberOfFollowers)
          console.log(result)
          db.User.findOneAndUpdate({username: result.username}, {"numberOfFollowers": numberOfFollowers}).then(result => {
            db.User.findByIdAndUpdate(infoDecoded.userId, { $addToSet: { 'following': result.username}}).then(result => {
              return res.status(200).json({
                message: `Following ${req.body.usernameToFollow}`
              })
            }).catch(err => {
              console.log(err);
              res.status(500).json({
                error: 'Unable to follow user.',
                issue: err
              });
            })
          }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: 'Unable to follow user.',
              issue: err
            });
          })
        }
      })
    };
//UNFOLLOW OTHER USER
userController.unfollow = (req, res, next) => {
      const jsonToken = req.headers.authorization.split(" ")[1];
      const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
      db.User.findOneAndUpdate({
        "username": req.body.usernameToUnfollow,
        "isDeleted": false
      }, { $pull: { 'followers': infoDecoded.username}}, {new: true}, function(err, result) {
        if (err) { err => {
          console.log(err);
          res.status(500).json({
            error: 'Unable to unfollow user.',
            issue: err
          })
        }
      }
        else {
          const numberOfFollowers = result.followers.length;
          console.log(numberOfFollowers)
          console.log(result)
          db.User.findOneAndUpdate({username: result.username}, {"numberOfFollowers": numberOfFollowers}).then(result => {
            db.User.findByIdAndUpdate(infoDecoded.userId, { $pull: { 'following': result.username}}).then(result => {
              return res.status(200).json({
                message: `You are not following ${req.body.usernameToUnfollow}`
              })
            }).catch(err => {
              console.log(err);
              res.status(500).json({
                error: 'Unable to unfollow user.',
                issue: err
              });
            })
          }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: 'Unable to unfollow user.',
              issue: err
            });
          })
        }
      })
    };
//SHOW FOLLOWERS
userController.showFollowers = (req, res, next) => {
  const skip = 100 * (req.body.pageNumber - 1)
  db.User.findOne({username: req.body.username, isDeleted: false}, {followers: {$slice:[skip, 2]}}).then(User => {
    if(!User){
      return res.status(500).json({
        error: "Unable to retrieve user's data",
        issue: err
      })
    } else {
      return res.status(200).json({
        success: true,
        user: User.username,
        data: User.followers
      });
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({
      error: err,
      issue: "Unable to retrieve user's data"
    })
  });
}
//SHOW FOLLOWING
userController.showFollowing = (req, res, next) => {
  const skip = 100 * (req.body.pageNumber - 1)
  db.User.findOne({username: req.body.username, isDeleted: false}, {following: {$slice:[skip, 2]}}).then(User => {
    if(!User){
      return res.status(500).json({
        error: "Unable to retrieve user's data",
        issue: err
      })
    } else {
      return res.status(200).json({
        success: true,
        user: User.username,
        data: User.following
      });
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({
      error: err,
      issue: "Unable to retrieve user's data"
    })
  });
}
//RESET PASSWORD #1 (SEND EMAIL WITH LINK TO RESET)
userController.forgotPassword = (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      db.User.findOne({ email: req.body.email }, function(err, User) {
        if (!User) {
          return res.status(500).json({
            error: err,
            issue: "Unable to reset password."
          })
        }
        else {
          User.resetPasswordToken = token;
          User.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          User.save(function(err) {
            done(err, token, User);
          });
        }
      })
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'fuzzelMusicSharing@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'fuzzelMusicSharing@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        return res.status(200).json({
          message: "An email has been sent to your account"
        });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  })
}
//RESET PASSWORD #2 (CHECK TOKEN AND CHANGE PASSWORD)
userController.resetPassword = (req, res, next) => {
  async.waterfall([
    function(done){
      db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.status(500).json({
            error: err,
            issue: "Unable to reset password, please try again."
          })
        }
        if(req.body.password === req.body.confirm) {
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            if (err) {
              return res.status(500).json({
                error: 'Unable to reset password, please try again.',
                issue: err
              });
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.password = hash
            user.save(function(err) {
              return res.status(200).json({
                message: `Password changed.`
              })
              done(err, user);
            });
          })
        } else {
          return res.status(500).json({
            error: err,
            issue: "Unable to reset password, please try again."
          })
        }
      });
    }
  ], function(err) {
    if (err) return next(err);
  })
}
//EXPORT CONTROLLERS
export default userController
