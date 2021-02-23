const Database = require("../configdata");
const config = require("../config");
const { makeid } = require("./utils");
const database = new Database(config.data);
var axios = require('axios');
exports.orders = async (req, res) => {
  var body = req.body;
  var user_id,
    orderid,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    fullName;
  let orderItems = [];
  orderItems = body.orderItems;
  user_id = body.userInfo.user_id;
  paymentMethod = body.paymentMethod;
  itemsPrice = body.itemsPrice;
  shippingPrice = body.shippingPrice;
  taxPrice = body.taxPrice;
  totalPrice = body.totalPrice;
  fullName = body.shippingAddress.fullName;
  orderid = await makeid(24, "ord");
  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: "Cart is empty" });
  } else {
    var query1 = [
      [
        user_id,
        orderid,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        fullName,
      ],
    ];
    await database
      .query(
        "INSERT INTO `core_orders`(`user_id`, `orderId`, `paymentMethod`, `itemsPrice`, `shippingPrice`, `taxPrice`, `totalPrice`,`fullName`) VALUES ?",
        [query1]
      )
      .then(async (users) => {
        console.log('success')
      })
      .catch((e) => {
        return console.log(e);
      });
    await orderItems.map(async (id) => {
      var values = [[user_id, orderid, id.product]];
      await database
        .query(
          "INSERT INTO `core_orders_items`(`user_id`, `orderId`, `itemId`) VALUES ?",
          [values]
        )
        .then(async (users) => {
        console.log('success');
        console.log('order creted ' + orderid);
        res.json({
          order: {
            id: orderid,
            shippingAddress: body.shippingAddress,
            orderItems: orderItems,
            paymentMethod : body.paymentMethod,
            itemsPrice : body.itemsPrice,
            shippingPrice : body.shippingPrice,
            taxPrice : body.taxPrice,
            totalPrice : body.totalPrice,
            isPaid:true,
            isDelivered:true,
          },
        });
        })
        .catch((e) => {
          return console.log(e);
        });
    });

  }
};

exports.orderDetails = async (req, res) => {
    console.log(req.params.id + 'hi');
    var orderdata;
    let itemsid = [];
    let imageurl = [];
    let orderItems = [];
    let currency = [];
    var user;
    await database
    .query("SELECT * FROM `core_orders` WHERE `orderId`=?",[req.params.id])
    .then(async (itm) => {
        var string = JSON.stringify(itm);
        var da = JSON.parse(string);
        orderdata = da[0];
       return database.query("SELECT * FROM `core_orders_items` WHERE `orderId`=?",[req.params.id]);
    })
    .then(async(itm) => {
      var string = JSON.stringify(itm);
      itemsid = JSON.parse(string);
      return database.query("SELECT * FROM `core_images`");
    })
    .then(async (itm) => {
      await itm.map((value, index) => {
        var string = JSON.stringify(value);
        var image = JSON.parse(string);
        imageurl.push(image);
      });
      console.log(orderdata);
      return database.query("SELECT * FROM `core_users` WHERE `user_id` = ?" ,[orderdata.user_id]);
    })
    .then(async (value) => {
      var string = JSON.stringify(value);
      var usr = JSON.parse(string);
      user = usr[0];
      return database.query("SELECT * FROM `bs_items_currency`");
    })
    .then(async (cur) => {
      await cur.map((value, index) => {
        var string = JSON.stringify(value);
        var curr = JSON.parse(string);
        currency.push(curr);
      });
      return database.query("SELECT * FROM `bs_items`");
    })
    .then(async (data) => {
      await data.map(async(value, index) => {
          itemsid.map((it) => {
          var string = JSON.stringify(value);
            var item = JSON.parse(string);
          if (item.id === it.itemId) {
            let data = {};
            let curre = {};
            data = imageurl.find((image) => image.img_parent_id === item.id);
            curre = currency.find((curre) => curre.id === item.item_currency_id);
            if (data !== undefined) {
              var str1 = "https://kariac.com/data.kariac.com/uploads/thumbnail/";
              var str2 = data.img_path;
              var res = str1.concat(str2);
              const element = {
                _id: item.id,
                name: item.title,
                images: res,
                price: item.price,
                qty: 1,
                currency_short_form: curre.currency_short_form,
                currency_symbol: curre.currency_symbol,
                brand: item.brand,
              };
              orderItems.push(element);
            }
           }
        });
      });

    })
    .catch((e) => {
      return console.log(e);
    });
  res.json({
    id: req.params.id,
    paymentMethod: orderdata.paymentMethod,
    itemsPrice: parseInt(orderdata.itemsPrice),
    shippingPrice:  parseInt(orderdata.shippingPrice),
    taxPrice:  parseInt(orderdata.taxPrice),
    totalPrice:  parseInt(orderdata.totalPrice),
    isPaid: orderdata.isPaid == 0 ? false : true,
    paidAt: "date",
    isDelivered: orderdata.isDelivered == 0 ? false : true,
    deliveredAt: orderdata.deliveredAt,
    orderItems: orderItems,
    shippingAddress: {
      fullName: orderdata.fullName,
      address: user.user_address,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
    },
  });
};


exports.orderPayment = async (req, res) => {
  console.log(req.body);
  var body = req.body;
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  console.log(datetime);
  console.log(body.paymentResult.flw_ref);
  console.log(body.paymentResult.transaction_id);
  console.log(body.order.id);
  await database.query("UPDATE `core_orders` SET `isPaid`=?, `isPaidAt`=? ,`flw_ref`=?, `transaction_id`=? WHERE `orderId`=?",
  [ '1', datetime, body.paymentResult.flw_ref, body.paymentResult.transaction_id , body.order.id  ])
  .then(() => {
    res.send({
      message: "order payment success",
    });
    return database.close();
  })
  .catch((e) => {
    console.log(e);
    res.status(401).send({
      message: "order failes",
    });
  })
};

exports.myorders = async (req,res) => {
  
  await database.query("SELECT * FROM `core_orders` WHERE `user_id`=? ORDER BY `createdAt` DESC",[req.body.userInfo.user_id] )
  .then((orders) => {
    res.send(orders);
  })
  .catch((e) => {
    console.log(e);
  });
};

exports.trackorders = async (req,res) => {
  var config = {
    method: 'get',
    url: 'https://onlinetools.ups.com/track/v1/details/7798339175?locale=en_US',
    headers: { 
      'Username': 'DevanshuDixit', 
      'AccessLicenseNumber': '3D90923F1B4F3392', 
      'Password': '8Z=2y;y8e$Z;X76'
    }
  };
  
  axios(config)
  .then(function (response) {
    let package = [];
    var string = JSON.stringify(response.data);
    var data = JSON.parse(string);
    let shipments =data.trackResponse.shipment;
    shipments.map((packages) => {
      package.push(packages.package[0]);
    })
    var element = {
      shipmentsLength: data.trackResponse.shipment.length,
      packagesLength:  package.length,
      package: package
    };
    res.send(element);
  })
  .catch(function (error) {
    console.log(error);
  });
};