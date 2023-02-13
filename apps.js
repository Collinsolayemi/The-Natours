const express = require('express');
const morgan = require('morgan');
const AppError = require('./utilities/appError');
const globalHandlerError = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json()); //middleware

if (process.env.NODE.ENV === 'development') {
  app.use(morgan('dev')); //middleware from npm(third-party middleware)
}

//middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

//imported middleware for the routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//middleware advance error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`), 404);
});

app.use(globalHandlerError);

module.exports = app;
//200 okay , 201 = created, 404 = err, 204 = delete , 500 = internal server error
