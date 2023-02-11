const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//route implementation and http request
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
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
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

module.exports = router;
