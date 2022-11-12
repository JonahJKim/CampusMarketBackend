const connection = require('../mysql/connection.js');
const create_table_sql = require('../mysql/create_table_sql.js');

const createTable = (req, res, next) => {
    connection.query(create_table_sql, (err, res, fields) => {
        if (err) {
            // throw Error;
            return res.send('Error creating table')
        }
    });
    next();
}

module.exports = createTable

