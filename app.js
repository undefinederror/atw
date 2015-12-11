'use strict';

var S = require('./atw/public/javascripts/Stopwatch.js');

var sw = S.create(1000 * 10);
sw.onTick(function () { console.log(sw.time) },1000);
sw.onComplete(function () { console.log('done->', sw.time) });
sw.start();



//var PouchDB = require('pouchdb');
//PouchDB.plugin(require('pouchdb-find'));
//var q = require('q');
//var _ = require('lodash');

////var db = new PouchDB('atw/db/questions');
//var db = new PouchDB('test');


////db.put({
////    _id: 'pippo',
////    body: {
////        prop:'val'
////    }
////}).then(function () {
////    return db.info();
////})
//db.info()
//.then(function (res) {
//    console.log(res)
//})
//.catch(function (res) {
//    console.log(res)
//})