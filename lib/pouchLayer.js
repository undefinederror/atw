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
            if (!obj.args._id) { setId(); break; }
            setN();
            d.resolve(queryDb(obj));
            break;
        case 'getIds':
            d.resolve(getIds(obj.limit));
            break;
        default:
            //q.delay(3000).then(function () {
                d.resolve(queryDb(obj));
            //})
            
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
                _.extend(obj.args, { _id: res.docs[0].n + 1 + '' });
            } else {
               _.extend(obj.args, { _id: '0'});
            }
            setN();
            d.resolve(queryDb(obj));
        });
    }

    function setN() {
        obj.args.n = obj.args._id * 1;
    }
}

module.exports = fn;

//var ar = { "n": 3, "cat": "test", "letter": { "a": { "q": "what starts with a?", "a": "a" }, "b": { "q": "what starts with b?", "a": "b" }, "c": { "q": "what starts with c?", "a": "c" }, "d": { "q": "what starts with d?", "a": "d" }, "e": { "q": "what starts with e?", "a": "e" }, "f": { "q": "what starts with f?", "a": "f" }, "g": { "q": "what starts with g?", "a": "g" }, "h": { "q": "what starts with h?", "a": "h" }, "i": { "q": "what starts with i?", "a": "i" }, "l": { "q": "what starts with l?", "a": "l" }, "m": { "q": "what starts with m?", "a": "m" }, "n": { "q": "what starts with n?", "a": "n" }, "o": { "q": "what starts with o?", "a": "o" }, "p": { "q": "what starts with p?", "a": "p" }, "q": { "q": "what starts with q?", "a": "q" }, "r": { "q": "what starts with r?", "a": "r" }, "s": { "q": "what starts with s?", "a": "s" }, "t": { "q": "what starts with t?", "a": "t" }, "u": { "q": "what starts with u?", "a": "u" }, "v": { "q": "what starts with v?", "a": "v" }, "z": { "q": "what starts with z?", "a": "z" } }, "_id": "3", "_rev": "11-fbb5901ce3327c6adbe80677ea6d4acc" };







//fn({
//    "name": "questions",
//    "method": "put",
//    "args": ar
    
    
//})
//.then(function (res) { 
//    console.log(res);

//})
//.catch(function (err) {
//    console.log(err);

//})
