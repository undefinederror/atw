importScripts('Stopwatch.js');

var sw = Stopwatch.create(60 * 1000, 1 * 1000);

console.log('sw created')
self.addEventListener('message', function (e) {
    var data = e.data;
    console.log(data.cmd);
    switch (data.cmd) {
        case 'start':
        case 'stop':
        case 'pause':
        case 'resume':
            sw[data.cmd]();
            break;
        case 'onTick':
        case 'onComplete':
            
            sw[data.cmd](eval(data.args));
            break;
    };
}, false);