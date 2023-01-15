const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json()); //middleware

//creating our own middleware

if (process.env.NODE.ENV === 'development') {
  app.use(morgan('dev')); //middleware from npm(third-party middleware)
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
//200 okay , 201 = created, 404 = err, 204 = delete , 500 = internal server error
