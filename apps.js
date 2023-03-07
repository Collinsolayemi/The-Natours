const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utilities/appError');
const globalHandlerError = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//middleware

//GLOBAL MIDDLEWARE
//set security http header
app.use(helmet());

//development logging
if (process.env.NODE.ENV === 'development') {
  app.use(morgan('dev')); //middleware from npm(third-party middleware)
}

//creating a limiter for number of request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter); //the limiter work on all routes starting with /api

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//serving static files
app.use(express.static(`${__dirname}/public`));

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// middleware for the routes url
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//middleware advance error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalHandlerError);

module.exports = app;
//200 okay , 201 = created, 404 = err, 204 = delete , 500 = internal server error 401= unauthorise 400=bad request
