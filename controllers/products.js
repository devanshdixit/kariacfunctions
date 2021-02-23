const Database = require("../configdata");
const config = require("../config");
const database = new Database(config.data);

exports.products = async (req, res) => {
  let items = [];
  var imageurl = [];
  let currency = [];
  let itemType = [];
  let itemLocation = [];
// var Tracking = require("ups-shipping/lib/tracking");
// var tracking = new Tracking('3D90923F1B4F3392', 'DevanshuDixit', '8Z=2y;y8e$Z;X76');
// tracking.useSandbox(true);
// tracking.makeRequest({
//   customerContext: "Customer Data",
//   trackingNumber : "572254454"
// }, function(err, data) {
// if (err) {
//   console.error(err);
// }

// if (data) {
//   //Enjoy playing the data :)
//   console.log(data);
// }
// });
// var acceptShipment = new ShipAccept('3D90923F1B4F3392', 'DevanshuDixit', '8Z=2y;y8e$Z;X76');
//   const UPS = require('ups-shipping-api');
// const ups = new UPS({
//     access_key : "3D90923F1B4F3392",
//     username : "DevanshuDixit",
//     password : "8Z=2y;y8e$Z;X76"
// });
// var test_shipment = {
//     shipper : {
//         address : {
//             country_code : "US",
//             postal_code : 36205,
//         },
//     },
//     ship_to : {
//         address : {
//             country_code : "US",
//             postal_code : 36207,
//         },
//     },
//     package : {
//         weight : 21, // the weight of the package
//         dimensions : {
//             length : 2,
//             width : 2,
//             height : 2,
//         }
//     }
// };
// var rates = await  ups.retreive_rates(test_shipment);
// console.log(rates);



  
  database
    .query("SELECT * FROM `core_images`")
    .then(async (itm) => {
      let images = [];
      await itm.map((value, index) => {
        var string = JSON.stringify(value);
        var image = JSON.parse(string);
        imageurl.push(image);
      });
      return database.query("SELECT * FROM `bs_items_types`");
    })
    .then(async (ty) => {
      await ty.map((value, index) => {
        var string = JSON.stringify(value);
        var typ = JSON.parse(string);
        itemType.push(typ);
      });
      return database.query("SELECT * FROM `bs_items_location`");
    })
    .then(async (la) => {
      await la.map((value, index) => {
        var string = JSON.stringify(value);
        var loc = JSON.parse(string);
        itemLocation.push(loc);
      });
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
      await data.map((value, index) => {
        var string = JSON.stringify(value);
        var item = JSON.parse(string);
        let data = {};
        let curre = {};
        let typ = {};
        let loc = {};
        data = imageurl.find((image) => image.img_parent_id === item.id);
        curre = currency.find((curre) => curre.id === item.item_currency_id);
        typ = itemType.find((type) => type.id === item.item_type_id);
        loc = itemLocation.find((loca) => loca.id === item.item_location_id);
        
        if (data !== undefined) {
          var str1 = "https://kariac.com/data.kariac.com/uploads/thumbnail/";
          var str2 = data.img_path;
          var res = str1.concat(str2);
          const element = {
            _id: item.id,
            name: item.title,
            image: res,
            price: item.price,
            countInStock: 10,
            itemtype: typ.name !== undefined ? typ.name : 'N/A',
            currency_short_form: curre.currency_short_form,
            currency_symbol: curre.currency_symbol,
            brand: item.brand,
            itemLocation: loc !== undefined ? loc.name : 'N/A',
            rating: 4.5,
            numReviews: 10,
            description: item.description,
          };
          items.push(element);
        }
      });
      return items;
    })
    .then((itrm) => {
      return res.send(itrm);
    });
};

exports.product = (req, res) => {
  let itemId = req.params.id;
  let items = [];
  var imageurl = [];
  let currency = [];
  database
    .query("SELECT * FROM `core_images`")
    .then(async (itm) => {
      let images = [];
      await itm.map((value, index) => {
        var string = JSON.stringify(value);
        var image = JSON.parse(string);
        imageurl.push(image);
      });
      return database.query("SELECT * FROM `bs_items_currency`");
    })
    .then(async (cur) => {
      await cur.map((value, index) => {
        var string = JSON.stringify(value);
        var curr = JSON.parse(string);
        currency.push(curr);
      });
      return database.query("SELECT * FROM `bs_items` WHERE `id`=?", [itemId]);
    })
    .then(async (data) => {
      await data.map(async(value, index) => {
        var string = JSON.stringify(value);
        var item = JSON.parse(string);
        let data = {};
        let curre = {};
        data = imageurl.filter((image) => image.img_parent_id === item.id);
        curre = currency.find((curre) => curre.id === item.item_currency_id);
        if (data !== undefined) {
          var str1 = "https://kariac.com/data.kariac.com/uploads/thumbnail/";
          let img = [];
          await data.map((im ,index) => {
            //img =  im.img_path}
            var str1 = "https://kariac.com/data.kariac.com/uploads/thumbnail/";
            var str2 = im.img_path;
            var res = str1.concat(str2);
            img.push(res);
          });
          var str2 = data.img_path;
          var res = str1.concat(str2);
          const element = { 
            _id: item.id,
            name: item.title,
            images: img,
            price: item.price,
            countInStock: 10,
            currency_short_form: curre.currency_short_form,
            currency_symbol: curre.currency_symbol,
            brand: item.brand,
            rating: 4.5,
            numReviews: 10,
            description: item.description,
          };
          items.push(element);
        }
      });
      return items;
    })
    .then((itrm) => {
      return res.send(itrm);
    });
};
