const Tour = require('./model/tourModel');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const dotenv = require('dotenv').config({ path: './config.env' });
const app = require('./apps');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succesful'));

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A tour must have a name'],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, 'A tour must have a price'],
//   },
// });

// //creating a model
// const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Sailing Ship',
  price: 345,
});


// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR', err);
//   });

// JUST TO TEST THE TOUR CREATED TO THE DATABASE
// const testTour = new Tour({
//   name: 'The Lion Kingdom',
//   rating: 4.9,
//   price: 450,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log('Error', err));

app.get('/', (req, res) => {
  res.send('servere');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Apps running on port ${port}`);
});

//console.log(process.env);
