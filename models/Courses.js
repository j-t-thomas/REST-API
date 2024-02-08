'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        title: {
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
        description: {
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
        estimatedTime: {
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
        materialsNeeded: {
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
        },
    }, { sequelize });

    Course.associate = (models) => {
        //Sequelize will know that a user can be associated with one or more courses
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userID',
            },
        });
    };

    return Course;
};