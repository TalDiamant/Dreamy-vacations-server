const Sequelize = require('sequelize');

const db={};

const sequelize = new Sequelize("myvacations", "root", "******", {
  host: "localhost",
  dialect: "mysql",
  operatorAliases: false,
  define: {
    timestamps: false
  },

  pool: {
    max: 10,
    min: 0,
    aquire: 20000,
    idle: 10000
  }
})

db.sequelize = sequelize;
db.Sequelize = sequelize;
module.exports = db;