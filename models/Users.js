'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required.'
                },
                notEmpty: {
                    msg: 'Please provide a first name.'
                },
            },
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A last name is required.'
                },
                notEmpty: {
                    msg: 'Please provide a last name.'
                },
            },
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'This email already exists.'
            },
            validate: {
                notNull: {
                    msg: 'An email is required.'
                },
                isEmail: {
                    msg: 'Please provide a valid email.'
                },
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required.'
                },
                notEmpty: {
                    msg: 'Please provide a password.'
                },
            },
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            },
        },


    }, 
    { sequelize });

    User.associate = (models) => {
        //Sequelize will know that a user can be associated with one or more courses
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return User;
};