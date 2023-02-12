const mongoose = require('mongoose');
const slugify = require('slugify');

//creating a tour schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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

// CREATNG DOCUMENT MIDDLEWARE
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
