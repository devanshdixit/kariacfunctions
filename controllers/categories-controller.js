const Database = require("../configdata");
const config = require("../config");
const connection = new Database(config.data);
module.exports = {

    cate: (req, res) => {
        connection.query('SELECT * from `bs_categories` WHERE `status` = 1', (err, rows) => {
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
    category: (req, res) => {
            connection.query('SELECT * from `bs_subcategories` WHERE `cat_id`=? AND `status` = 1',
                [req.params.categoryid],
                (err, rows) => {
                    res.setHeader('Content-Type', 'application/json');  
                    res.status(200).send(JSON.stringify(
                        {
                            'result' : 'success',
                            'data': rows
                        }
                        )
                    );
                });
    },
    subcategory: (req, res) => {
            connection.query('SELECT * FROM `bs_items` WHERE `cat_id` = ? AND `sub_cat_id` = ?',
                [req.params.categoryid,req.params.subcategoryid],
                (err, rows) => {
                    res.setHeader('Content-Type', 'application/json');  
                    res.status(200).send(JSON.stringify(
                        {
                            'result' : 'success',
                            'data': rows
                        }
                        )
                    );
                });
    },
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