var Stopwatch = (function () {
    var t,
        t1=0,
        t2=0,
        tot,
        tick,
        tIntId = null,
        cbacks = {},
        secs2Time = function (secs) {
            var hours = Math.floor(secs / (60 * 60)),
                minutes = Math.floor(secs / 60),
                seconds = Math.floor(secs % 60),
                obj = {
                    "h": hours.toString().length === 1 ? '0' + hours : hours,
                    "m": minutes.toString().length === 1 ? '0' +
                        minutes : minutes,
                    "s": seconds.toString().length === 1 ? '0' +
                        seconds : seconds
                };
            return obj;
        },
        formatTime = function (timeObj) {
            return timeObj.h + ':' + timeObj.m + ':' + timeObj.s;
        },
        cbackHandler = function (cback, name) {
            if (typeof cback === 'function') {
                cbacks[name] = cback;
            }
        },
        calc = function () { t= tot - (t2 - t1); },
        tIntFn= function () {
            t2 = new Date().getTime();
            calc();
            if(cbacks.onTick) cbacks.onTick();
            if (t <= 0) fnComplete();
        },
        fnComplete = function () {
            proto.pause();
            // invalidate resume, pause
            if (cbacks.onComplete) cbacks.onComplete();
        },
        fnTick = function () { 
            if (cbacks.onTick) cbacks.onTick();
        }
        tIntSet = function () {
            tIntId = setInterval(tIntFn, tick);
        },
        proto = {
            start: function () {
                t = tot;
                t1 = new Date().getTime();
                tIntSet();
            },
            pause: function () {
                tIntId = clearTimeout(tIntId);
                t2 = new Date().getTime();
                calc();
            },
            resume: function () {
                tot = t;
                t1 = new Date().getTime();
                tIntSet();
            },
            onTick: function (cback) {
                cbackHandler(cback, 'onTick');
            },
            onComplete: function (cback) {
                cbackHandler(cback, 'onComplete');
            }
        };
    var propObj = {
        time: {
            get: function () {
                return formatTime(secs2Time((t / 1000) | 0));
            },
            set: function () {
                console.warn('yeah right...');
                return false;
            }
        }
    };
    return {
        create: function (argTot, argTick) {
            // args in millisenconds
            tot = argTot;
            t = tot;
            tick = argTick;
            return Object.create(proto, propObj);
        }
    }
})();