const Sequelize = require('sequelize');
const db = require('../DB/db');

module.exports = db.sequelize.define(
    'vacations',
    {
        id:{
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        description: {
            type:Sequelize.STRING(255),
            allowNull: false
        },
        destination:{
            type: Sequelize.STRING(30),
            allowNull: false
        },
        picture: {
            type: Sequelize.TEXT,//change to long-text
            allowNull: false
        },
        startDate:{
            type: Sequelize.STRING(30),
            allowNull: false
        },
        endDate:{
            type: Sequelize.STRING(30),
            allowNull: false
        },
        price:{
            type: Sequelize.INTEGER(11),
            allowNull:false
        }
    }
)