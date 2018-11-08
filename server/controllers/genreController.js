//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
//GET PROMISES TO WORK
mongoose.Promise = global.Promise;
//CONFIGURE CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const genreController = {};
//CREATE GENRE
genreController.createGenre = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  var result = new Date(infoDecoded.createdAt);
  result.setDate(result.getDate() + 15)
 if (Date.now()<result) {
    return res.status(401).json({
      message: "Your account must be greater than 15 days old before you can set up a new genre."
    })
  }
  else {
    const Genre = new db.Genre({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      admins: infoDecoded.username,
      REFusers: infoDecoded.username,
      numberOfUsers: 1
    });
    Genre.save().then(newGenre => {
      console.log(newGenre);
      db.User.findByIdAndUpdate(
        infoDecoded.userId,
        { $push: { 'REFgenres': newGenre.title } }
      ).then((existingUser) => {
        console.log(existingUser);
        return res.status(201).json({
        message: "Genre successfully created!",
      });
    }).catch((err) => {
      res.status(500).json({
        error: err
      });
    });
      console.log(newGenre);
    }).catch(err => {
    console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }
};
//GET GENRE PAGE
genreController.getGenre = (req, res, next) => {
  db.Genre.findOne(
    {
      title: req.params.genre
    },
    '-REFusers -admins -bannedAccounts'
  ).then((Genre) => {
    if(!Genre){
      return res.status(500).json({
        error: "Unable to retrieve genre's data",
        issue: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: Genre
      });
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({
      error: err,
      issue: "Unable to retrieve genre's data"
    })
  });
};
//UPDATE PAGE EXPLANATION
genreController.updatePage = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findById(req.body.genreId).then(Genre => {
    if(!Genre) {
      return res.status(500).json({
        error: 'Unable to update genre.'
      })
    }
    else {
      if(Genre.admins.indexOf(infoDecoded.username) === -1) {
        return res.status(500).json({
          error: 'You are not an admin to this page'
        })
      }
      else {
        db.Genre.findByIdAndUpdate(Genre._id, { explanation: req.body.explanation }).then(result => {
          console.log(result);
          res.status(200).json({
            message: "Genre updated"
          })
        }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: 'Unable to update Genre',
            issue: err
          });
        })
      }
    }
  }).catch(err => {
    return res.status(500).json({
      error: 'Unable to change cover picture.',
      issue: err
    });
  })
}
//UPDATE COVER PICTURE
genreController.newCoverPic = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findById(req.body.genreId).then(Genre => {
    if(!Genre) {
      return res.status(500).json({
        error: 'Unable to update genre.'
      })
    }
    else {
      if(Genre.admins.indexOf(infoDecoded.username) === -1) {
        return res.status(500).json({
          error: 'You are not an admin to this page'
        })
      }
      else {
        const originalName = req.files.genreCoverPicture.name
        if (/\.(jpg|jpeg|png|gif)$/.test(originalName)) {
          cloudinary.v2.uploader.upload_stream({ folder: "Fuzzel_1/Genre_Cover_Pictures/"}, function(error, result) {
            console.log(result, error);
            if(error){
              return res.status(500).json({
                error: 'Unable to change cover picture.',
                issue: err
              });
            }
            else {
              db.Genre.findByIdAndUpdate(req.body.genreId, {
                coverPicture: result.secure_url
              }).then(result => {
                console.log(result);
                return res.status(200).json({
                  message: "Genre updated!"
                })
              }).catch(err => {
                console.log(err);
                return res.status(500).json({
                  error: 'Unable to change cover picture.',
                  issue: err
                });
              });
            }
          }).end(req.files.genreCoverPicture.data)
        }
        else {
          return res.status(500).json({
            error: 'Only image files are allowed.',
          });
        }
      }
    }
  }).catch(err => {
      return res.status(500).json({
      error: 'Unable to change cover picture.',
      issue: err
    });
  })
}
//UPDATE PROFILE PICTURE
genreController.newPagePic = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findById(req.body.genreId).then(Genre => {
    if(!Genre) {
      return res.status(500).json({
        error: 'Unable to update genre.'
      })
    }
    else {
      if(Genre.admins.indexOf(infoDecoded.username) === -1) {
        return res.status(500).json({
          error: 'You are not an admin to this page'
        })
      }
      else {
        const originalName = req.files.genrePagePicture.name
        if (/\.(jpg|jpeg|png|gif)$/.test(originalName)) {
          const filename = `Fuzzel_1/Page_Pictures/${Genre.title}_PagePic`
          cloudinary.v2.uploader.upload_stream({
            public_id: filename,
            invalidate: true
          }, function(error, result) {
            console.log(result, error);
            if(error){
              return res.status(500).json({
                error: 'Unable to change page picture.',
                issue: err
              });
            }
            else {
              db.Genre.findByIdAndUpdate(req.body.genreId, {
                pagePicture: `${process.env.BASE_CLOUDINARY_URL}image/upload/${filename}`
              }).then(result => {
                console.log(result);
                return res.status(200).json({
                  message: "Genre updated!"
                })
              }).catch(err => {
                console.log(err);
                return res.status(500).json({
                  error: 'Unable to change page picture.',
                  issue: err
                });
              });
            }
          }).end(req.files.genrePagePicture.data)
        }
        else {
          return res.status(500).json({
            error: 'Only image files are allowed.',
          });
        }
      }
    }
  }).catch(err => {
      return res.status(500).json({
      error: 'Unable to change page picture.',
      issue: err
    });
  })
}
//MAKE ADMIN
genreController.makeAdmin = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findById(req.body.genreId).then(Genre => {
    if(!Genre) {
      return res.status(500).json({
        error: 'Unable to add admin.'
      })
    }
    else {
      if(Genre.admins.indexOf(infoDecoded.username) === -1) {
        return res.status(500).json({
          error: 'You are not an admin to this page'
        })
      }
      else {
        db.Genre.findByIdAndUpdate(Genre._id, { $addToSet: { 'admins': req.body.potentialAdminUsername}}).then(result => {
          res.status(200).json({
            message: "Admin added"
          })
        }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: 'Unable to add admin',
            issue: err
          });
        })
      }
    }
  }).catch(err => {
    return res.status(500).json({
      error: 'Unable to add admin.',
      issue: err
    });
  })
}
//BAN ACCOUNT
genreController.banAccount = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findById(req.body.genreId).then(Genre => {
    if(!Genre) {
      return res.status(500).json({
        error: 'Unable to ban account.'
      })
    }
    else {
      if(Genre.admins.indexOf(infoDecoded.username) === -1) {
        return res.status(500).json({
          error: 'You are not an admin to this page'
        })
      }
      else {
        db.Genre.findByIdAndUpdate(Genre._id, { $addToSet: { 'bannedAccounts': req.body.potentialBannedUsername}}).then(result => {
          res.status(200).json({
            message: `${req.body.potentialBannedUsername} has been banned from posting or commenting on this genre page.`
          })
        }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: 'Unable to ban account.',
            issue: err
          });
        })
      }
    }
  }).catch(err => {
    return res.status(500).json({
      error: 'Unable to ban account.',
      issue: err
    });
  })
}
//REMOVE BAN
genreController.removeBan = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findById(req.body.genreId).then(Genre => {
    if(!Genre) {
      return res.status(500).json({
        error: 'Unable to remove.'
      })
    }
    else {
      if(Genre.admins.indexOf(infoDecoded.username) === -1) {
        return res.status(500).json({
          error: 'You are not an admin to this page'
        })
      }
      else {
        db.Genre.findByIdAndUpdate(Genre._id, { $pull: { 'bannedAccounts': req.body.bannedUsername}}).then(result => {
          return res.status(200).json({
            message: `${req.body.bannedUsername} is no longer banned from this genre.`
          })
        }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: 'Unable to remove.',
            issue: err
          });
        })
      }
    }
  }).catch(err => {
    return res.status(500).json({
      error: 'Unable to remove.',
      issue: err
    });
  })
}
//SHOW A GENRE'S FOLLOWING
genreController.showUsers = (req, res, next) => {
  const skip = 100 * (req.body.pageNumber - 1)
  db.Genre.findById(req.body.genreId, {REFusers: {$slice:[skip, 2]}}).then(Genre => {
    if(!Genre){
      return res.status(500).json({
        error: "Unable to retrieve genre's data",
        issue: err
      })
    } else {
      return res.status(200).json({
        success: true,
        user: Genre.title,
        data: Genre.following
      });
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({
      error: err,
      issue: "Unable to retrieve genre's data"
    })
  });
}
//JOIN GENRE
genreController.join = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findByIdAndUpdate(req.body.genreId, { $addToSet: { 'REFusers': infoDecoded.username}}, {new: true}, function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Unable to join requested genre.',
        issue: err
      })
    }
    else {
      const numberOfFollowers = result.REFusers.length;
      db.Genre.findByIdAndUpdate(result._id, {numberOfUsers: numberOfFollowers}).then(result => {
        db.User.findByIdAndUpdate(infoDecoded.userId, { $addToSet: { 'REFgenres': result.title}}).then(User => {
          return res.status(200).json({
            message: `You are now following music posted to ${req.body.title}.`
          })
        }).catch(err => {
          return res.status(500).json({
          error: 'Unable to join requested genre',
          issue: err
        })
      })
      }).catch(err => {
        return res.status(500).json({
        error: 'Unable to join requested genre',
        issue: err
      })
    })
    }
  })
}
//LEAVE GENRE
genreController.leave = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Genre.findByIdAndUpdate(req.body.genreId, { $pull: { 'REFusers': infoDecoded.username}}, {new: true}, function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Unable to leave requested genre.',
        issue: err
      })
    }
    else {
      const numberOfFollowers = result.REFusers.length;
      db.Genre.findByIdAndUpdate(result._id, {numberOfUsers: numberOfFollowers}).then(result => {
        db.User.findByIdAndUpdate(infoDecoded.userId, { $pull: { 'REFgenres': infoDecoded.username}}).then(User => {
          return res.status(200).json({
            message: `You are now no longer following music posted to ${req.body.title}.`
          })
        }).catch(err => {
          return res.status(500).json({
          error: 'Unable to leave requested genre',
          issue: err
        })
      })
      }).catch(err => {
        return res.status(500).json({
        error: 'Unable to leave requested genre',
        issue: err
      })
    })
    }
  })
}
//EXPORT CONTROLLERS
export default genreController
