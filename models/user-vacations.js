const Sequelize = require('sequelize');
const db = require('../DB/db');

module.exports = db.sequelize.define(
    'user-vacations',
    {
        userid:{
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            allowNull: false
        },
        vacationid: {
            type:Sequelize.INTEGER(11),
            primaryKey: true,
            allowNull: false
        },
        destination: {
            type:Sequelize.STRING(11),
            primaryKey: true,
            allowNull: false
        }
    }
)