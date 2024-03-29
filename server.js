const Tour = require('./model/tourModel');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./apps');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.log('MongoDB connection error', err);
  });

//starting the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Apps running on port ${port}`);
});

//handling unhandled rejected promises
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
