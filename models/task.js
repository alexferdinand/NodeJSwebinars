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
                connection.query('SELECT * FROM `tasks`', (err, rows) => {
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
                connection.query('SELECT * FROM `tasks` WHERE tasks_id = ?', id, (err, rows) => {
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
                connection.query('UPDATE `tasks` SET task = ?  WHERE tasks_id = ?', [task.task, id], (err, result) => {
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
                if (task.task !== '') {
                connection.query('INSERT INTO `tasks` (task, users_id) VALUES (?, ?)', [task.task, task.users_id], (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                    connection.release();
                    resolve(result.insertId);
                }); } else {
                    reject("Пустое значение")
                }
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

                connection.query('DELETE FROM `tasks` WHERE tasks_id = ?', id, (err, result) => {
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