const mysql = require('mysql');
const config = require('./config.json');
const bcrypt = require('bcryptjs')
const saltRounds = 12;
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

    this.findOne = function (username) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release()
                    reject(err);
                }
                connection.query('SELECT * FROM `users` WHERE username = ?', username, (err, rows) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }
                    const clearRows = JSON.parse(JSON.stringify(rows));

                    connection.release();
                    resolve(clearRows);
                })
            })
        })
    }

    this.updateById = function (id, task) {
        console.log(task)
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release()
                    reject(err)
                }

                const salt = bcrypt.genSaltSync(saltRounds)
                task.password = bcrypt.hashSync(task.password, salt)
                connection.query('UPDATE `users` SET name = ?, email = ?, age = ?, username = ?, password = ? WHERE users_id = ?', [task.name, task.email, task.age, task.username, task.password, id], (err, result) => {
                    if (err) {
                        connection.release()
                        reject(err)
                    }

                    connection.release()
                    resolve(result)
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

                connection.query('INSERT INTO `users` (name, email, age, username, password) VALUES (?, ?, ?)', [task.name, task.email, task.age, task.username, task.password], (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                    connection.release();
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