const connection = require('../config.js');
var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://208.109.41.246', {
    user     : 'u282083066_karia',
    password : 'kariac#123',
    database : 'u282083066_kariac',
});
var bucket = cluster.bucket('default');
module.exports = {
    all: (req, res) =>  {
        connection.query('SELECT * from `bs_items`', async (err, rows) => {
            var data = [];
            var imageurl = [];
             for (const key in rows)  {
                var image = await connection.query('SELECT * FROM `core_images` WHERE `img_parent_id`=?',[rows[key].id], (err, rows) => {
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
                if (Object.hasOwnProperty.call(rows, key)) {
                    const element = {
                    '_id': rows[key].id,
                    'name': rows[key].title,
                    'image': '/images/p1.jpg',
                    'price':  rows[key].price,
                    'countInStock': 10,
                    'brand': rows[key].brand,
                    'rating': 4.5,
                    'numReviews': 10,
                    'description': rows[key].description,
                    };
                    data.push(element);
                }
            }
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(data));
            } else {
                    console.log('Connection is asleep (time to wake it up): ', err);
                    setTimeout(handleDisconnect, 1000);
                    connection.handleDisconnect();
                
            }
        });
    },
    itemcurrency: (req, res) => {
        connection.query('SELECT * FROM `bs_items_currency` WHERE `id`=?',[req.params.itemcurrencyid], (err, rows) => {
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
    itemtype: (req, res) => {
        connection.query('SELECT * FROM `bs_items_types` WHERE id = ?',[req.params.itemtypeid], (err, rows) => {
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
    itemlocation: (req, res) => {
        connection.query('SELECT * FROM `bs_items_location` WHERE id =?',[req.params.itemlocationid], (err, rows) => {
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
    imageurl: (req, res) => {
        connection.query('SELECT * FROM `core_images` WHERE `img_parent_id`=?',[req.params.itemid], (err, rows) => {
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