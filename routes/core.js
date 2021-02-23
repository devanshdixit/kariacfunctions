var express = require("express");
const { products, product } = require("../controllers/products");
const userRouter = require("./users");
const ordersRouter = require("./orders");
const { blogs,blog } = require("../controllers/blogs");
var router = express.Router();
var axios = require('axios');
var cors = require("cors");

router.get("/product", cors(),products );
router.get("/product/:id", product);
router.use('/users',userRouter);
router.use('/orders', ordersRouter);


router.get('/config/paypal',(req,res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
router.get('/blogs', blogs );
router.get('/prices', (req,res) => {
  var config = {
    method: 'get',
    url: 'http://api.currencylayer.com/live?access_key=c31aba0cae892d26ab727e6e74710908&currencies=USD,NGN,CAD,PLN,MXN&format=1',
  };
  
  axios(config)
  .then(function (response) {
    res.send(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
});
router.get('/blog/:blogId', blog );
router.get("/hi", (req, res) => {
  res.send("hello hi asdasdasdasdadsddsads aff ");
});

router.get('/me/from/token', function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
   return res.status(401).json({message: 'Must pass token'});
  }
// Check token that was passed by decoding token using secret
 jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) throw err;
   //return user using the id from w/in JWTToken
    User.findById({
    '_id': user._id
    }, function(err, user) {
       if (err) throw err;
          user = utils.getCleanUser(user); 
         //Note: you can renew token by creating new token(i.e.    
         //refresh it)w/ new expiration time at this point, but I’m 
         //passing the old token back.
         // var token = utils.generateToken(user);
        res.json({
            user: user, 
            token: token
        });
     });
  });
});


module.exports = router;
