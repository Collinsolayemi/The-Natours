const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//creating a tour schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal with 40 characters'],
      minlength: [10, 'A tour name must have less or equal than 40 characters'],
      //using the validator from an external library
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must haave a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratings must be above 1.0'],
      max: [5, 'ratings must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //using a custom validator {we use the validate keyword with a call back function}
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      require: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// CREATNG DOCUMENT MIDDLEWARE {it work on only .save() and .create()}
// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

//implementing a document middleware which run before data saved in db....save() and .create()
// tourSchema.pre('save', function (next) {
// this.slug = slugify(this.name, { lower: true });
//   next();
// });

//implementing a document middleware with post method which have access to the doc saved and next
//the post start after the pre() have finish
// tourSchema.post('save', function (doc, next) {
// console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {  or we use
tourSchema.pre(/^find/, function (next) {
  //it will work for any find or methos that start with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//for a post request
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//Aggregtion middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//creating a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
