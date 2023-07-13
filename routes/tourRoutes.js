const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();
const authController = require('../controllers/authController');

//route implementation and http request
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/top-5-cheap')
  //.get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    //only the admin role and lead guide can delete  tour
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router.post('/', tourController.createTour);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

module.exports = router;
