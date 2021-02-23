const connection = require('../config.js');

module.exports = {
    all: (req, res) => {
        connection.query('SELECT * FROM `core_users`', (err, rows) => {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(
                    {
                        'result' : 'success',
                        'data': rows
                    })
                );
            } else {
                res.status(400).send(err);
            }
        });
    },

    categories: (req, res) => {
        connection.query('SELECT * FROM `bs_categories` WHERE 1', (err, rows) => {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(
                    {
                        'result' : 'success',
                        'data': rows
                    })
                );
            } else {
                res.status(400).send(err);
            }
        });
    },

    create: (req, res, next) => {
        let response;
        const name = req.body.name;
        const isbn = req.body.isbn;
        if (
            typeof name !== 'undefined'
            && typeof isbn !== 'undefined'
        ) {
            connection.query('INSERT INTO books (name, isbn) VALUES (?, ?)',
                [name, isbn],
                (err, result) => {
                    handleSuccessOrErrorMessage(err, result, res);
                });

        } else {
            response = {
                'result' : 'error',
                'msg' : 'Please fill required details'
            };
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(response));
        }
    },

    get: (req, res) => {
        connection.query('SELECT * from books where id = ?', [req.params.id], (err, rows) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(
                {
                    'result' : 'success',
                    'data': rows[0]
                })
            );
        })
    },

    update: (req, res) => {
        let response;
        const name = req.body.name;
        const isbn = req.body.isbn;
        const id = req.params.id;
        console.log(name, isbn, 'yooo');
        if (
            typeof name !== 'undefined'
            && typeof isbn !== 'undefined'
        ) {
            connection.query('UPDATE books SET name = ?, isbn = ? WHERE id = ?',
                [name, isbn, id],
                function(err, result) {
                    handleSuccessOrErrorMessage(err, result, res);
                });
        } else {
            response = {'result' : name, 'msg' : 'Please fill required information'};
            res.setHeader('Content-Type', 'application/json');
            res.send(200, JSON.stringify(response));
        }
    },
    update_premium: (req, res) => {
        let response;
        console.log(req.body.premium);
        console.log(req.body.user_id);
        const name = req.body.premium;
        const id = req.body.user_id;
        if (
            typeof name !== 'undefined'
        ) {
            connection.query('UPDATE `core_users` SET `premium_user`= ?  WHERE `user_id` = ? ',
                [name, id],
                function(err, result) {
                    handleSuccessOrErrorMessage(err, result, res);
                });
        } else {
            response = {'result' : name, 'msg' : 'Please fill required information'};
            res.setHeader('Content-Type', 'application/json');
            res.send(200, JSON.stringify(response));
        }
    },

    destroy: (req, res) => {
        connection.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, result) => {
            handleSuccessOrErrorMessage(err, result, res);
        });
    }
};

function handleSuccessOrErrorMessage(err, result, res) {
    if (!err){
        let response;
        if (result.affectedRows != 0) {
            response = {'result' : 'success'};
        } else {
            response = {'msg' : 'No Result Found'};
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
    } else {
        res.status(400).send(err);
    }
}