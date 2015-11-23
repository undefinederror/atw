importScripts('Stopwatch.js');

var sw = Stopwatch.create(60 * 1000, 1 * 1000);


self.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
        case 'stop':
        case 'pause':
        case 'resume':
            sw[data.cdm]();
            break;
        case 'onTick':
        case 'onComplete':
            sw[data.cdm](data.args);
            break;
    };
}, false);