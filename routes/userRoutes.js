const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

//the user routes
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/forget-password').post(authController.forgetPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);

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
