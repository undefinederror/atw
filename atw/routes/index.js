var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();

var folderRoutes =
 {
    html: app.get('views'),
    jade: app.get('views'),
    js: path.join(__dirname, '../public/javascripts'),
    css: path.join(__dirname, '../public/stylesheets')
}


router.get(/\/(.*)/, function (req, res, next) {
    var 
        reqPath = req.params[0] || 'index.html',
        ext = reqPath.match(/(?:\w|\d(?!\.))*$/).toString() || 'html'
    ;
    if (ext === 'jade') { 
        res.render(path.join(folderRoutes[ext], reqPath), {title:'atw'});
    } else {
        res.sendFile(path.join(folderRoutes[ext], reqPath));
    }
});
router.post(/\/(.*)/, function (req, res, next) {
    var 
        reqPath = req.params[0] || '',
        ext = reqPath.match(/(?:\w|\d(?!\.))*$/).toString(),
        _res=res
    ;
    if (ext === 'serv') {
        require('../../lib/pouchLayer.js')(req.body)
        .then(function (res) {
            _res.send(res);
        })
        .catch(function (err) {
            if (err.message) err = { message: err.message };
            _res.status(500).send(err);
        });
        
        
    }
});
module.exports = router;
