var Stopwatch = (function () {
    // private contr fns
    
    function extend(target,obj) {
        for (var p in obj) { 
            target[p] = obj[p];
        }
        return target;
    }

    function create(argTot) {
        // args in millisenconds
        
        // private stuff
        var t,
            t1 = 0,
            t2 = 0,
            tot = t = argTot,
            tick,
            tTickId = null,
            tTotId=  null,
            cbacks = {},
            cbackHandler = function (cback, name) {
                if (typeof cback === 'function') {
                    cbacks[name] = cback;
                } else { 
                    console.warn(name, ': callback is not a function');
                }
            },
            calc = function () { t = tot - (t2 - t1); },
            fnTick = function () {
                if (cbacks.onTick) cbacks.onTick();
            },
            tTickFn = function () {
                t2 = new Date().getTime();
                //calc();
                if (cbacks.onTick) cbacks.onTick();
            },
            tTickSet = function () {
                if(cbacks.onTick){
                    tTickId = setInterval(tTickFn, tick);
                }
            },
            fnComplete = function () {
                pubMets.stop();
                if (cbacks.onComplete) cbacks.onComplete();
            },
            tTotSet = function () {
                tTotId = setTimeout(fnComplete, t);
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

                t = argTot;
                t1 = new Date().getTime();
                tTotSet();
                tTickSet();
            },
            pause: function () {
                if (!validMets.pause) return false;
                t2 = new Date().getTime();
                validMets.pause = false;
                validMets.resume = true;

                tTickId = clearInterval(tTickId);
                tTotId = clearTimeout(tTotId);
            },
            resume: function () {
                if (!validMets.resume) return false;
                validMets.resume = false;
                validMets.pause = true;

                tot = t;
                t1 = new Date().getTime();
                tTickSet();
                tTotSet();
            },
            stop: function () {
                if (!validMets.stop) return false;
                this.pause();
                validMets.stop = false;
                validMets.start = true;
                validMets.pause = false;
                validMets.resume = false;
                t = tot = t1 = t2 = 0;
            },
            onTick: function (cback, argTick) {
                if (typeof argTick === 'number' && 
                    argTick*1=== argTick &&
                    argTick > 0) {
                    tick = argTick;
                    cbackHandler(cback, 'onTick');
                } else {
                    console.warn('onTick: argTick is not a positive integer')
                }
            },
            onComplete: function (cback) {
                cbackHandler(cback, 'onComplete');
            }
        };
        var propObj = {
            time: {
                enumerable:true,
                get: function () {
                    calc();
                    //return formatTime(secs2Time((t / 1000) | 0));
                    return t;
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