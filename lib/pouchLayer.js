'use strict';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var q = require('q');
var _ = require('lodash');


function fn(obj){ 
    var rel = process.cwd().split('atw').length > 2?'db/':'atw/db/';
    var d = q.defer();
    var db = new PouchDB(rel + obj.name);
    switch (obj.method) {
        case 'put':
            !obj.args._id && setId();
            break;
        case 'getIds':
            d.resolve(getIds(obj.limit));
            break;
        default:
            d.resolve(queryDb(obj));
            break;
    }
    
    return d.promise;
    
    function queryDb(obj) {
        if (obj.args) {
           // return db.find(obj.args)
           return db[obj.method](obj.args);
        }
        else {
            return db[obj.method]();
        } 
    }
    
    function getIds(limit) { 
        return db.find({
            selector: { n: { "$exists": true } },
            fields: ["n"],
            sort: [{ n: 'desc' }],
            limit: limit
        });
    }
    
    function setId() { 
        // if id missing get greatest and increment by 1
        getIds(1)
        .then(function (res) {
            if (res.docs.length ===1) {
                _.extend(obj.args, { _id: res.docs[0].n+1+'', n: res.docs[0].n+1 });
            } else {
               _.extend(obj.args, { _id: '0', n: 0 });
            }
            d.resolve(queryDb(obj));
        });
    } 
}

module.exports = fn;

//fn({
//    "name": "questions",
//    "method": "createIndex",
//    "args": {
//        index: {
//            fields: ["n"],
//            type='text'
//        }
    
//    }
    
    
//})
//.then(function (res) { 
//    console.log(res);

//})
//.catch(function (err) {
//    console.log(err);

//})
