const express = require('express');
const { User } = require('./models'); 
const { Course } = require('./models');
const router = express.Router();
const { authenticateUser } = require('./middleware/auth-user');


//User Routes
// get all the users
router.get('/users', authenticateUser, async (req, res) => {
    const {id, firstName, lastName, emailAddress} = req.currentUser;
    res.status(200).json({
        id, 
        firstName, 
        lastName,
        emailAddress,
    });
});
   
   
// POST to create a new user
router.post('/users', async (req, res) => {
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
   
});

//Course Routes (Error in Postman)
router.get('/courses', async (req, res, next) => {
    try {
      const courses = await Course.findAll({
        attributes: [
          'id',
          'title',
          'description',
          'estimatedTime',
          'materialsNeeded',
          'userId'
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'emailAddress'
            ],
          },
        ],
      });
      res.json(courses);
    } catch (error) {
      next(error);
    }
  });
  
  router.get('/courses/:id', async (req, res, next) => {
    try {
      const course = await Course.findAll({
        where: {
          id: req.params.id,
        },
        attributes: [
          'id',
          'title',
          'description',
          'estimatedTime',
          'materialsNeeded',
          'userId'
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'emailAddress'
            ],
          },
        ],
      });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      next(error);
    }
  });
  
  // Route that creates a new user.
  router.post('/courses', authenticateUser, async (req, res) => {
    let newCourse;
    try {
      newCourse = await Course.create(req.body);
      res
        .status(201)
        .location('/courses/' + newCourse.id)
        .end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        next(error);
      }
    }
  });
  
  //update a course by ID 
  router.put('/courses/:id', authenticateUser, async (req, res, next) => {
    try {
    let course = await Course.findByPk(req.params.id);
    
      if (course) {
        if (req.currentUser.id === course.userId) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res.status(403).json({ message: 'User is not the authorized owner of this course.' });
        }
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((e) => e.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  });
  
  //Delete a course by ID
  router.delete('/courses/:id', authenticateUser, async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    try {
      if (req.currentUser.id != course.userId) {
        res.status(403).json({ message: 'User is not the authorized owner of this course.' });
      } else {
        await course.destroy();
        res.status(204).end();
      }
    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;