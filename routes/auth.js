const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  authController.googleAuthCallback
);


router.get('/failure', authController.loginFailure);

module.exports = router;
