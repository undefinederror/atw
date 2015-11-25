var S = require('./atw/public/javascripts/Stopwatch.js');

var sw = S.create(1000 * 5);
//sw.onTick(function () { console.log(Math.floor(sw.time/1000)) },1000);
sw.onComplete(function () { console.log('done->', sw.time) });
sw.start();