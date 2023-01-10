const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// router.post('/', tourController.createTour);

module.exports = router;
