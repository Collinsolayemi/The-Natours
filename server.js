const Tour = require('./model/tourModel');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const dotenv = require('dotenv').config({ path: './.env' });
const app = require('./apps');
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'));

const testTour = new Tour({
  name: 'The Sailing Ship',
  price: 345,
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Apps running on port ${port}`);
});
