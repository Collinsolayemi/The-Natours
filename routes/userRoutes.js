const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

//the user routes
router.route('/signup').post(authController.signUp);
router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
