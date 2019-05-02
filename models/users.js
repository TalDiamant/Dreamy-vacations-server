const Sequelize = require('sequelize');
const db = require('../DB/db');

module.exports = db.sequelize.define(
    'users',
    {
        id:{
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING(30),
            allowNull: false,
            unique: true
        },
        password:{
            type: Sequelize.STRING(30),
            allowNull: false
        },
        firstname: {
            type:Sequelize.STRING(30),
            allowNull: false
        },
        lastname:{
            type: Sequelize.STRING(30),
            allowNull: false
        },
    }
)