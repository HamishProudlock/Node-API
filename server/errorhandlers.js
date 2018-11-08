//DEPENDENCIES
import express from 'express';

const errorhandler = express();

errorhandler.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
})

errorhandler.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
//EXPORT TO APP
export default errorhandler
