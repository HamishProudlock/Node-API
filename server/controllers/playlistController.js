//DEPENDENCIES
import db from './../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
//GET PROMISES TO WORK
mongoose.Promise = global.Promise;
//EMPTY OBJECT TO HOLD ALL CONTROLLERS
const playlistController = {};
//CREATE PLAYLIST
playlistController.createPlaylist = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const userInfo = jwt.decode(jsonToken, process.env.JWT_KEY);
  const Playlist = new db.Playlist({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    creator: userInfo.userId,
  });
  Playlist.save().then(newPlaylist => {
    return res.status(201).json({
      message: `Your playlist, ${newPlaylist.title}, has been successfully created!`,
    });
  }).catch(err => {
  console.log(err);
    return res.status(500).json({
      error: err
    });
  });
};
//UPDATE TITLE
playlistController.update = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Playlist.findOneAndUpdate({
    _id: req.body.playlistId,
    creator: infoDecoded.username
  }, {title: req.body.title}).then(playlist => {
    return res.status(201).json({
      message: `Your playlist's name has been changed.`,
    });
  }).catch(err => {
  console.log(err);
    return res.status(500).json({
      error: err
    });
  })
};
//DELETE PLAYLIST
playlistController.delete = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Playlist.findOneAndUpdate({
    _id: req.body.playlistId,
    creator: infoDecoded.username
  }, {isDeleted: true}).then(playlist => {
    return res.status(201).json({
      message: `Your playlist's has been deleted.`,
    });
  }).catch(err => {
  console.log(err);
    return res.status(500).json({
      error: err
    });
  })
}
//LIST PLAYLISTS
playlistController.list = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Playlist.find({
    creator: infoDecoded.userId,
    isDeleted: false
  }, '-creator').then(results => {
    return res.status(200).json({
      success: true,
      data: results
    });
  }).catch(err => {
  console.log(err);
    return res.status(500).json({
      error: err
    });
  })
}
//GET PLAYLIST INDIVIDUALLY
playlistController.get = (req, res, next) => {
  const jsonToken = req.headers.authorization.split(" ")[1];
  const infoDecoded = jwt.decode(jsonToken, process.env.JWT_KEY);
  db.Playlist.findById(req.body.playlistId, '-creator').then(results => {
    return res.status(200).json({
      success: true,
      data: results
    });
  }).catch(err => {
  console.log(err);
    return res.status(500).json({
      error: err
    });
  })
}
//EXPORT CONTROLLERS
export default playlistController
