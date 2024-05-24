const path = require('path');
const Sequelize = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db.sqlite'),
    logging: false
});

// console.log(process.env.NODE_ENV);

// let db;
// if (process.env.NODE_ENV === "test") {
//     db = new Sequelize("sqlite::memory:", { logging: false });
// } else {
//     db = new Sequelize({
//     dialect: 'sqlite',
//     storage: path.join(__dirname, 'db.sqlite'),
//     logging: false,
//     });
// };

module.exports = db;