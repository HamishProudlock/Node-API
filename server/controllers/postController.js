//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
//CONFIGURE CLOUDINARY
cloudinary.config({cloud_name: process.env.CLOUDNAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET})
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const postController = {};
//CREATE POST
postController.createPost = (req, res, next) => {
  const originalName = req.files.song.name
  console.log(req.body.title)
  if (/\.(mp3)$/.test(originalName)) {
    const jsonToken = req.headers.authorization.split(" ")[1];
    const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
    cloudinary.v2.uploader.upload_stream({
      folder: "Fuzzel_1/Songs/",
      resource_type: "video"
    }, function(error, result) {
      if (error) {
        return res.status(500).json({error: 'Unable to upload post.', issue: error});
      } else {
        const Post = new db.Post({
          _id: new mongoose.Types.ObjectId(),
          title: req.body.title,
          song: result.secure_url,
          image: infoDecoded.avatar,
          genre: req.body.genre,
          creator: infoDecoded.username
        })
        Post.save().then(result => {
          return res.status(201).json({message: "Post successfully uploaded!"});
        }).catch(err => {
          res.status(500).json({issue: "Unable to upload post.", error: err});
        })
      }
    }).end(req.files.song.data)
  } else {
    return res.status(500).json({error: 'Only mp3 files are allowed.'});
  }
}
//DELETE POST
postController.deletePost = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Post.findOneAndUpdate({
    _id: req.body.postId,
    creator: infoDecoded.username
  }, {isDeleted: true}).then(result => {
    if (result) {
      return res.status(200).json({message: "post successfully deleted."})
    } else {
      return res.status(500).json({message: "You can only delete your own posts"});
    }
  }).catch(err => {
    return res.status(500).json({error: err});
  })
}
//GET POSTS FOR A GENRE 24H
postController.getForGenre24h = (req, res, next) => {
  if (req.body.lastScore === undefined) {
    var TIME = new Date();
    TIME.setDate(TIME.getDate() - 1)
    var USE = TIME.toISOString()
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $gte: USE
      }
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  } else {
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $lte: req.body.lastDate
      },
      score: req.body.lastScore
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      const extra = results.length
      if (extra === 100) {
        return res.status(200).json({message: "success", data: results})
      } else {
        var TIME = new Date();
        var USE = TIME.setDate(TIME.getDate() - 1)
        db.Post.find({
          isDeleted: false,
          createdAt: {
            $gte: USE
          },
          score: {
            $lt: req.body.lastScore
          },
          genre: req.params.genre
        }).sort({score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
          const data = results.concat(secondResults)
          return res.status(200).json({message: "success", data: data})
        }).catch(err => {
          return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
        })
      }
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  }
}
//GET POSTS FOR A GENRE 72H
postController.getForGenre72h = (req, res, next) => {
  if (req.body.lastScore === undefined) {
    var TIME = new Date();
    TIME.setDate(TIME.getDate() - 3)
    var USE = TIME.toISOString()
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $gte: USE
      }
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  } else {
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $lte: req.body.lastDate
      },
      score: req.body.lastScore
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      const extra = results.length
      if (extra === 100) {
        return res.status(200).json({message: "success", data: results})
      } else {
        var TIME = new Date();
        var USE = TIME.setDate(TIME.getDate() - 3)
        db.Post.find({
          isDeleted: false,
          createdAt: {
            $gte: USE
          },
          score: {
            $lt: req.body.lastScore
          },
          genre: req.params.genre
        }).sort({score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
          const data = results.concat(secondResults)
          return res.status(200).json({message: "success", data: data})
        }).catch(err => {
          return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
        })
      }
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  }
}
//GET POSTS FOR A GENRE WEEK
postController.getForGenreWeek = (req, res, next) => {
  if (req.body.lastScore === undefined) {
    var TIME = new Date();
    TIME.setDate(TIME.getDate() - 7)
    var USE = TIME.toISOString()
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $gte: USE
      }
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  } else {
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $lte: req.body.lastDate
      },
      score: req.body.lastScore
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      const extra = results.length
      if (extra === 100) {
        return res.status(200).json({message: "success", data: results})
      } else {
        var TIME = new Date();
        var USE = TIME.setDate(TIME.getDate() - 7)
        db.Post.find({
          isDeleted: false,
          createdAt: {
            $gte: USE
          },
          score: {
            $lt: req.body.lastScore
          },
          genre: req.params.genre
        }).sort({score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
          const data = results.concat(secondResults)
          return res.status(200).json({message: "success", data: data})
        }).catch(err => {
          return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
        })
      }
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  }
}
//GET POSTS FOR A GENRE MONTH
postController.getForGenreMonth = (req, res, next) => {
  if (req.body.lastScore === undefined) {
    var TIME = new Date();
    TIME.setDate(TIME.getDate() - 31)
    var USE = TIME.toISOString()
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $gte: USE
      }
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  } else {
    db.Post.find({
      isDeleted: false,
      genre: req.params.genre,
      createdAt: {
        $lte: req.body.lastDate
      },
      score: req.body.lastScore
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      const extra = results.length
      if (extra === 100) {
        return res.status(200).json({message: "success", data: results})
      } else {
        var TIME = new Date();
        var USE = TIME.setDate(TIME.getDate() - 31)
        db.Post.find({
          isDeleted: false,
          createdAt: {
            $gte: USE
          },
          score: {
            $lt: req.body.lastScore
          },
          genre: req.params.genre
        }).sort({score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
          const data = results.concat(secondResults)
          return res.status(200).json({message: "success", data: data})
        }).catch(err => {
          return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
        })
      }
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find posts for this genre.", error: err})
    })
  }
}
//GET POSTS FOR A USER
postController.getForUser = (req, res, next) => {
  if (req.body.lastdate === undefined) {
    db.Post.find({isDeleted: false, creator: req.params.username}).sort({createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find any posts for this user.", error: err})
    })
  } else {
    db.Post.find({
      isDeleted: false,
      createdAt: {
        $lt: req.body.lastdate
      },
      creator: req.params.username
    }).sort({createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find any posts for this user.", error: err})
    })
  }
}
//GET POSTS FOR HOMEPAGE
postController.getForHomepage24h = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.User.findById(infoDecoded.userId).then(User => {
    const Genres = User.REFgenres
    if (req.body.lastScore === undefined) {
      var TIME = new Date();
      TIME.setDate(TIME.getDate() - 1)
      var USE = TIME.toISOString()
      db.Post.find({
        isDeleted: false,
        genre: {
          $in: Genres
        },
        createdAt: {
          $gte: USE
        }
      }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
        return res.status(200).json({message: "success", data: results})
      }).catch(err => {
        return res.status(500).json({issue: "Unable to find posts for Homepage.", error: err})
      })
    } else {
      db.Post.find({
        isDeleted: false,
        genre: {
          $in: Genres
        },
        createdAt: {
          $lte: req.body.lastDate
        },
        score: req.body.lastScore
      }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
        const extra = results.length
        if (extra === 100) {
          return res.status(200).json({message: "success", data: results})
        } else {
          var TIME = new Date();
          var USE = TIME.setDate(TIME.getDate() - 1)
          db.Post.find({
            isDeleted: false,
            createdAt: {
              $gte: USE
            },
            score: {
              $lt: req.body.lastScore
            },
            genre: {
              $in: Genres
            }
          }).sort({score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
            const data = results.concat(secondResults)
            return res.status(200).json({message: "success", data: data})
          }).catch(err => {
            return res.status(500).json({issue: "Unable to find posts for Homepage.", error: err})
          })
        }
      }).catch(err => {
        return res.status(500).json({issue: "Unable to find posts for Homepage.", error: err})
      })
    }
  }).catch(err => {
    return res.status(500).json({issue: "Unable to find posts for Homepage.", error: err})
  })
}
//GET FROM FOLLOWING USERS
postController.getFromFollowing = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.User.findById(infoDecoded.userId).then(User => {
    const following = User.following
    if (req.body.lastdate === undefined) {
      db.Post.find({
        isDeleted: false,
        creator: {
          $in: following
        }
      }).sort({createdAt: -1}).limit(100).then(results => {
        return res.status(200).json({message: "success", data: results})
      }).catch(err => {
        return res.status(500).json({issue: "Unable to find posts from subscriptions.", error: err})
      })
    } else {
      db.Post.find({
        isDeleted: false,
        createdAt: {
          $lt: req.body.lastdate
        },
        creator: {
          $in: following
        }
      }).sort({createdAt: -1}).limit(100).then(results => {
        return res.status(200).json({message: "success", data: results})
      }).catch(err => {
        return res.status(500).json({issue: "Unable to find posts from subscriptions.", error: err})
      })
    }
  }).catch(err => {
    return res.status(500).json({issue: "Unable to find posts from subscriptions.", error: err})
  })
}
//GET ALL TOP ALL TIME POSTS
postController.getAllTimeTop = (req, res, next) => {
  if (req.body.lastScore === undefined) {
    db.Post.find({isDeleted: false}).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      return res.status(200).json({message: "success", data: results})
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find all time top posts.", error: err})
    })
  } else {
    db.Post.find({
      isDeleted: false,
      createdAt: {
        $lte: req.body.lastDate
      },
      score: req.body.lastScore
    }).sort({score: -1, createdAt: -1}).limit(100).then(results => {
      const extra = results.length
      if (extra === 100) {
        return res.status(200).json({message: "success", data: results})
      } else {
        db.Post.find({
          isDeleted: false,
          score: {
            $lt: req.body.lastScore
          }
        }).sort({score: -1, createdAt: -1}).limit(100 - extra).then(secondResults => {
          const data = results.concat(secondResults)
          return res.status(200).json({message: "success", data: data})
        }).catch(err => {
          return res.status(500).json({issue: "Unable to find all time top posts.", error: err})
        })
      }
    }).catch(err => {
      return res.status(500).json({issue: "Unable to find all time top posts.", error: err})
    })
  }
}
//EXPORT CONTROLLERS
export default postController
