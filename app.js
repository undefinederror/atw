//var S = require('./atw/public/javascripts/Stopwatch.js');

//var sw = S.create(1000 * 5);
////sw.onTick(function () { console.log(Math.floor(sw.time/1000)) },1000);
//sw.onComplete(function () { console.log('done->', sw.time) });
//sw.start();

'use strict';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var q = require('q');
var _ = require('lodash');

var db = new PouchDB('test');


db.put({
    _id: 'pippo',
    body: {
        prop:'val'
    }
}).then(function () {
    return db.info();
})
.then(function (res) { 
    console.log(res)
})
.catch(function (res) {
    console.log(res)
})