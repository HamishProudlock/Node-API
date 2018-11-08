//DEPENDENCIES
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import fileupload from 'express-fileupload';
import bodyparser from 'body-parser';
//IMPORTING ROUTES
import routes from './routes';
//IMPORTING ERROR HANDLERS
import errorhandlers from './errorhandlers';
//FIXING MONGOOSE PROMISE ERROR
mongoose.Promise = global.Promise;
//CONNECTING TO DATABASE
mongoose.connect(`mongodb://Fuzzellead:${process.env.MONGODB_PASSWORD}@fifth-attempt-shard-00-00-rl9oc.mongodb.net:27017,fifth-attempt-shard-00-01-rl9oc.mongodb.net:27017,fifth-attempt-shard-00-02-rl9oc.mongodb.net:27017/test?ssl=true&replicaSet=fifth-attempt-shard-0&authSource=admin&retryWrites=true`, { useMongoClient: true }).then(docs => {console.log('Database connection made')}).catch(err => {console.log(err);});
//CREATING AN INSTANCE OF EXPRESS
const app = express();
//MIDDLEWARE
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({extended:true}));
app.use(fileupload());
app.use(morgan('dev'));
//ROUTES
app.use('/api', routes);
//ERRORS
app.use(errorhandlers)
//EXPORT TO INDEX.JS
export default app;
