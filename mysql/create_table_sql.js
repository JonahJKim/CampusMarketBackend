let create_table_sql = `
CREATE TABLE IF NOT EXISTS users (
id int PRIMARY KEY AUTO_INCREMENT, 
lastName varchar(255) NOT NULL,
firstName varchar(255) NOT NULL,
email varchar(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL

)`;

module.exports = create_table_sql