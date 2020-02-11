const mysql = require('mysql');
const config = require('./config.json');

const pool = mysql.createPool(config);


module.exports = function () {
    this.getAll = function () {
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                }
                connection.query('SELECT * FROM `users`', (err, rows) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }
                    console.log(rows)
                    const clearRows = JSON.parse(JSON.stringify(rows));
                    // const clearRows = {...rows};

                    connection.release();
                    resolve(clearRows);
                });
            });
        }));
    }

    this.getById = function (id) {
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                }
                connection.query('SELECT * FROM `users` WHERE users_id = ?', id, (err, rows) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }
                    const clearRows = JSON.parse(JSON.stringify(rows));
                    // const clearRows = {...rows};

                    connection.release();
                    resolve(clearRows);
                });
            });
        }));
    }

    this.updateById = function (id, task) {
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                }

                connection.query('UPDATE `users` SET name = ?, email = ?, age = ?  WHERE users_id = ?', [task.name, task.email, task.age, id], (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                    connection.release();
                    resolve(result);
                });
            });
        }));
    }

    this.add = function (task) {
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                }

                connection.query('INSERT INTO `users` (name, email, age) VALUES (?, ?, ?)', [task.name, task.email, task.age], (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                    connection.release();
                    console.log(result.insertId)
                    resolve(result.insertId);
                });
            });
        }));
    }

    this.deleteById = function (id) {
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                }

                connection.query('DELETE FROM `users` WHERE users_id = ?', id, (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                    connection.release();
                    console.log(result)
                    resolve();
                });
            });
        }));
    }
}