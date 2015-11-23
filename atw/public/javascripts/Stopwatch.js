var Stopwatch = (function () {
    // private contr fns
    function secs2Time(secs) {
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
    }
    function formatTime(timeObj) {
        return timeObj.h + ':' + timeObj.m + ':' + timeObj.s;
    }
    function extend(target,obj) {
        for (var p in obj) { 
            target[p] = obj[p];
        }
        return target;
    }

    function create(argTot, argTick) {
        // args in millisenconds
        
        // private stuff
        var t,
            t1 = 0,
            t2 = 0,
            tot = t = argTot,
            tick = argTick,
            tIntId = null,
            cbacks = {},
            cbackHandler = function (cback, name) {
                if (typeof cback === 'function') {
                    cbacks[name] = cback;
                }
            },
            calc = function () { t = tot - (t2 - t1); },
            tIntFn = function () {
                t2 = new Date().getTime();
                calc();
                if (cbacks.onTick) cbacks.onTick();
                if (t <= 0) fnComplete();
            },
            fnComplete = function () {
                pubMets.pause();
                if (cbacks.onComplete) cbacks.onComplete();
            },
            fnTick = function () {
                if (cbacks.onTick) cbacks.onTick();
            },
            tIntSet = function () {
                tIntId = setInterval(tIntFn, tick);
            },
            validMets = {
                start: true,
                pause: false,
                resume: false,
                stop:false
            };
        
        // public instance methods
        var pubMets = {
            
            start: function () {
                if (!validMets.start) return false;
                validMets.start = false;
                validMets.stop = true;
                validMets.pause = true;

                t = tot;
                t1 = new Date().getTime();
                tIntSet();
            },
            pause: function () {
                if (!validMets.pause) return false;
                validMets.pause = false;
                validMets.resume = true;

                tIntId = clearTimeout(tIntId);
                t2 = new Date().getTime();
                calc();
            },
            resume: function () {
                if (!validMets.resume) return false;
                validMets.resume = false;
                validMets.pause = true;

                tot = t;
                t1 = new Date().getTime();
                tIntSet();
            },
            stop: function () {
                if (!validMets.stop) return false;
                validMets.stop = false;
                validMets.start = true;
                validMets.pause = false;
                validMets.resume = false;
                
                this.pause();
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
                enumerable:true,
                get: function () {
                    return formatTime(secs2Time((t / 1000) | 0));
                },
                set: function () {
                    console.warn('yeah right...');
                    return false;
                }
            }
        };

        var o = Object.create({}, propObj);
        return extend(o, pubMets);

    }
    return {create: create}
})();

if(typeof module === 'object' && typeof module.exports === 'object') module.exports=Stopwatch;