var Pouch = require('pouchdb');
var q = require('q');


function fn(obj) {
    var d = q.defer();
    var db = new Pouch(obj.name);
    if (obj.method ==='put' && !obj.args._id) {
        setId();
    }
    else{
        d.resolve(queryDb(obj));
    }
    return d.promise;

    function queryDb(obj) { 
        return db[obj.method](obj.args);
    }
    function setId() { 
        // if id missing get greatest and increment by 1
        db.allDocs({ descending: true, limit: 1 }, function (err, res) {
            if (res.total_rows > 0) {
                obj.args._id = (res.rows[0].id*1+1).toString()
            } else {
                obj.args._id = '0';
            }
            d.resolve(queryDb(obj));
        });
    }
}

module.exports = fn;
//fn({
//    "name": "questions3",
//    "method": "destroy",
//    "args": "1"
    
    
//})
//.then(function (res) { 
//    console.log(res);

//})
//.catch(function (err) {
//    console.log(err);

//})

//fn({
//    "name": "questions",
//    "method": "allDocs",
//   args: {}

//})
//.then(function (res) { 
//    console.log(res);

//})
//.catch(function (err) {
//    console.log(err);

//})
