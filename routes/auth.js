const express = require('express');
const {userSignUpValidator, passwordResetValidator} = require('./../validator/index')
const {userById} = require('./../controllers/user')
const router = express.Router();
const {
    signin,
    signup,
    signout,
    forgotPassword,
    resetPassword,
    socialLogin
} = require('./../controllers/auth')

router.post('/signup',userSignUpValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);
router.put('/forgot-password',forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);
router.post("/social-login", socialLogin); 
//any route containing : userId, our app will first exwcute userById()
router.param('userId', userById);

module.exports = router;

