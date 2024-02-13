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
                    msg: 'A title is required.'
                },
                notEmpty: {
                    msg: 'Please provide a title.'
                },
            },
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required.'
                },
                notEmpty: {
                    msg: 'Please provide a description.'
                },
            },
        },
        estimatedTime: {
            type: Sequelize.STRING,

        },
        materialsNeeded: {
            type: Sequelize.STRING,

        },
    }, { sequelize });

    Course.associate = (models) => {
        //Sequelize will know that a user can be associated with one or more courses
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
            },
        });
    };

    return Course;
};