//DEPENDENCIES
import express from 'express';
//IMPORT CONTROLLERS
import userController from './controllers/userController';
import genreController from './controllers/genreController';
import playlistController from './controllers/playlistController';
import postController from './controllers/postController';
import commentController from './controllers/commentController';
import subCommentController from './controllers/subCommentController';
import postVoteController from './controllers/postVoteController';
import commentVoteController from './controllers/commentVoteController';
//INSTANCE OF EXPRESS
const routes = express();
//--USER-ROUTES-----------------------------------------------------------------
routes.post('/u/createUser', userController.createUser);
routes.post('/u/login', userController.login);
routes.get('/u/account/:username', userController.getUser);
routes.get('/u/', userController.username);
routes.put('/u/deleteUser', userController.delete);
routes.put('/u/update', userController.update);
routes.put('/u/updateProfilePicture', userController.newProfilePic);
routes.put('/u/updateCoverPicture', userController.newCoverPic);
routes.put('/u/follow', userController.follow);
routes.put('/u/unfollow', userController.unfollow);
routes.post('/u/showFollowers', userController.showFollowers);
routes.post('/u/showFollowing', userController.showFollowing);
routes.post('/u/forgotPassword', userController.forgotPassword);
routes.post('/u/resetPassword/:token', userController.resetPassword);
//------------------------------------------------------------------------------

//--GENRE-ROUTES----------------------------------------------------------------
routes.post('/g/createGenre', genreController.createGenre);
routes.get('/g/:genre', genreController.getGenre);
routes.put('/g/updateCoverPicture', genreController.newCoverPic);
routes.put('/g/updatePagePicture', genreController.newPagePic);
routes.put('/g/updatePage', genreController.updatePage);
routes.put('/g/addAdmin', genreController.makeAdmin);
routes.put('/g/banAccount', genreController.banAccount);
routes.put('/g/removeBan', genreController.removeBan);
routes.post('/g/showUsers', genreController.showUsers);
routes.put('/g/join', genreController.join);
routes.put('/g/leave', genreController.leave);
//------------------------------------------------------------------------------

//--PLAYLIST-ROUTES-------------------------------------------------------------
routes.post('/pl/createPlaylist', playlistController.createPlaylist);
routes.put('/pl/updatePlaylist', playlistController.update);
routes.put('/pl/deletePlaylist', playlistController.delete);
routes.get('/pl/list', playlistController.list);
routes.post('/pl/get', playlistController.get);
//------------------------------------------------------------------------------

//--POST-ROUTES-----------------------------------------------------------------
routes.post('/p/createPost', postController.createPost);
routes.put('/p/deletePost', postController.deletePost);
routes.post('/p/24/:genre', postController.getForGenre24h);
routes.post('/p/72/:genre', postController.getForGenre72h);
routes.post('/p/week/:genre', postController.getForGenreWeek);
routes.post('/p/month/:genre', postController.getForGenreMonth);
routes.post('/p/u/:username', postController.getForUser);
routes.post('/p/24/', postController.getForHomepage24h);
routes.post('/p/u/', postController.getFromFollowing);
routes.post('/p/allTime', postController.getAllTimeTop);
//------------------------------------------------------------------------------

//--COMMENT-ROUTES--------------------------------------------------------------
routes.post('/c/createComment', commentController.createComment);
routes.put('/c/deleteComment', commentController.deleteComment);
routes.put('/c/updateComment', commentController.updateComment);
routes.post('/c/get', commentController.getAll);
//------------------------------------------------------------------------------

//--SUBCOMMENT-ROUTES-----------------------------------------------------------
routes.post('/sc/createSubComment', subCommentController.createSubComment);
routes.put('/sc/deleteSubComment', subCommentController.deleteSubComment);
routes.put('/sc/updateSubComment', subCommentController.updateSubComment);
routes.post('/sc/get', subCommentController.getSubComments);
//------------------------------------------------------------------------------

//POST-VOTE-ROUTES--------------------------------------------------------------
routes.post('/pv/vote', postVoteController.vote);
//------------------------------------------------------------------------------

//COMMENT-VOTE-ROUTES-----------------------------------------------------------
routes.post('/cv/vote', commentVoteController.vote);
//------------------------------------------------------------------------------
//EXPORT ROUTES TO APP.JS
export default routes
