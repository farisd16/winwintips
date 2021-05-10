const express = require('express');
const { check, body } = require('express-validator');

const User = require('../models/user');
const clientController = require('../controllers/client');

const router = express.Router();

router.get('/', clientController.getIndex);

router.get('/about', clientController.getAbout);

router.get('/table', clientController.getTable);

router.get('/register', clientController.getRegister);

router.post(
    '/register',
    [
        body('username', 'registration-input-username')
            .isLength({ min: 5, max: 16 })
            .isAlphanumeric()
            .custom((value, { req }) => {
                return User.findOne({ username: value }).then(userDoc => {
                    if (userDoc) {
                      return Promise.reject(
                        'registration-input-username-exists'
                      );
                    }
                  });
            })
            .trim(),
        body('email', 'registration-input-email')
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                  if (userDoc) {
                    return Promise.reject(
                      'registration-input-email-exists'
                    );
                  }
                });
            })
            .normalizeEmail(),
        body('password', 'registration-input-password')
            .isLength({ min: 5, max: 40 })
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    return Promise.reject(
                        'registration-input-confirm-password'
                      );
                }
                return true;
            }),
        body('ageCheck')
            .custom((value, { req }) => {
                if (!value) {
                    return Promise.reject(
                        'age'
                      );
                }
                return true;
            })
    ],
    clientController.postRegister);

router.get('/rules', clientController.getRules);

router.post('/login', clientController.postLogin);

router.post('/logout', clientController.postLogout);

// router.get('/reset-password', clientController.getResetPassword);

// router.post('/reset-password', clientController.postResetPassword);

router.get('/reset-password/:token', clientController.getNewPassword);

router.post('/new-password', clientController.postNewPassword);

router.get('/activate', clientController.getActivate);

router.post('/activate', clientController.postActivate);

module.exports = router;