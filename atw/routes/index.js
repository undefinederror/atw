var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();

var folderRoutes =
 {
    html: app.get('views'),
    js: path.join(__dirname, '../public/javascripts'),
    css: path.join(__dirname, '../public/stylesheets')
}

/* GET home page. */
router.get(/\/(.*)/, function (req, res, next) {
    var 
        reqPath = req.params[0] || 'index.html',
        ext = reqPath.match(/(?:\w|\d(?!\.))*$/).toString() || 'html'
    ;
    res.sendFile(path.join(folderRoutes[ext], reqPath));
});

module.exports = router;
