const Database = require("../configdata");
const config = require("../config");
const { generateToken, makeid } = require("./utils");
const database = new Database(config.data);
var bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  var body = req.body;
  var hash = bcrypt.hashSync(body.password.trim(), 10);
  var er = false;

  var user_id = makeid(24, "usr");
  await database
    .query("SELECT * FROM `core_users`")
    .then((users) => {
      let usr = [];
      usr = users.find(
        (user) =>
          user.user_id === user_id || user.user_email === body.email.trim()
      );
      if (usr !== undefined) {
        er = true;
        return res.status(401).send({ message: "User Already Exist" });
      }
    })
    .catch((e) => {
      return console.log(e);
    });
  if (!er) {
    try {
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
      var values = [
        [
          user_id,
          "0",
          body.name.trim(),
          body.email.trim(),
          hash,
          "4",
          "1",
          "0",
          "0",
        ],
      ];
      database
        .query(
          "INSERT INTO `core_users`(`user_id`, `user_is_sys_admin`,  `user_name`, `user_email`, `user_password`, `role_id`, `status`, `is_banned`, `overall_rating`) VALUES ?",
          [values]
        )
        .then((user) => {
          var user = {
            user_id: user_id,
            name: body.name.trim(),
            email: body.email.trim(),
            password: hash,
            admin: false,
            isEmailVerified: false,
          };
          var token = generateToken(user);
          user = { ...user, token: token };
          console.log(user);
          return res.json(user);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }
};
exports.signin = async (req, res) => {
  var body = req.body;
  var user;
  let er = false;
  await database
    .query("SELECT * FROM `core_users` WHERE `user_email`=?", body.email.trim())
    .then(async (value) => {
      if (value !== null) {
        var string = JSON.stringify(value[0]);
        var token;
        user = JSON.parse(string);
        await bcrypt.compare(
          body.password.trim(),
          user.user_password,
          function (err, valid) {
            if (!valid) {
              return res.status(404).json({
                error: true,
                message: "Username or Password is Wrong",
              });
            }
            var use = {
              user_id: user.user_id,
              name: user.user_name,
              email: user.user_email,
              password: user.user_password,
              admin: false,
              isEmailVerified: false,
              shippingAddress: {
                address: user.user_address,
                city: user.city,
                country: user.country,
                fullName: user.fullName,
                postalCode: user.postalCode,
              }
            };
            token = generateToken(use);
            use = { ...use, token: token };
            return res.json(use);
          }
        );
      }
    })
    .catch((e) => {
      res.status(404).json({
        error: true,
        message: "Username or Password is Wrong",
      });
    });
};

exports.shipping = async (req, res) => {
  var body = req.body;
  console.log(body);
  await database
    .query(
      "UPDATE `core_users` SET `user_address`=?,`city`=?,`postalCode`=?,`country`=?,`fullName`=?  WHERE `user_id`=?",
      [
        body.address.trim(),
        body.city.trim(),
        body.postalCode.trim(),
        body.country.trim(),
        body.fullName.trim(),
        body.userid.trim(),
      ]
    )
    .then(async (value) => {
      return res.send({ status: "success" });
    })
    .catch((e) => {
      return res.status(404).json({
        error: true,
        message: "address not saved",
      });
    });
};