const Database = require("../configdata");
const config = require("../config");
const database = new Database(config.data);

exports.blogs = async (req,res) => {
    let blogs = [];
    console.log('efaff');
    await database.query('SELECT * FROM `bs_feeds`')
    .then(async(value) => {
        var string = JSON.stringify(value);
        var curr = JSON.parse(string);
        console.log(value);
        await curr.map((it) => {
            var element = {
                id : it.id,
                name: it.name,
                addedDate: it.added_date, 
            };
            blogs.push(element);
        });
        res.send(blogs);
    })
    .catch(() => {
        res.statusCode = 404;
        res.send('Error while fetching Blogs!!');
    });
};
exports.blog = async (req,res) => {
    await database.query('SELECT * FROM `bs_feeds` WHERE `id`=?',[req.params.blogId])
    .then(async(value) => {
        var string = JSON.stringify(value);
        var curr = JSON.parse(string);
        res.send(curr);
    })
    .catch((e) => {
        console.log(e);
    });
    
};