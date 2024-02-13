'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate the request using Basic auth.
exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

     //if user exists in the database
    if (credentials) {

        const user = await User.findOne({ where: {emailAddress: credentials.name }});

        if(user) {
          const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            
          // If the passwords match store the received user object on the request object
          if (authenticated) {
              console.log(
              `Authentication successful for user's email: ${user.emailAddress}`);

              req.currentUser = user;
          } else {
                message = `Authentication failure for user's email: ${user.emailAddress}`;
          }
        } else {
          message = `User not found for user's email: ${credentials.name}`;
        }
    } else {
      message = `Auth header not found`;
    }
  // Return a response with a 401 Unauthorization HTTP status code if User auth fails
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
        
};
