const express = require('express');
const { Course, User } = require('../models');
const router = express.Router();


//User Routes
router.get('/User', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName,
        emailAddress: user.emailAddress,
    });
}));
   
   
// POST to create a new user
router.post('/Users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);

        res.status(201).setHeader('Location', '/').end()
    } catch (error) {
        console.log('Error: ', error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            next(err);
        }
    }
   
}));

module.exports = router;