(function(){
	'use strict';
    // var
    window.atw = window.atw || {};

	var
		letterArr=['a','b','c','d','e','f','g','h','i','l','m','n','o','p','q','r','s','t','u','v','z'],
        $parent = $('#circleContainer'),
        $qContainer = $parent.find('#questionContainer'),
        $pass = $qContainer.find('[data-action=pass]'),
        $start=$qContainer.find('[data-action=start]'),
        $qText = $qContainer.find('.question'),
        $ans = $qContainer.find('.ans'),
        $stats = $('#stats'),
        $statsR = $stats.find('.right'),
        $statsW = $stats.find('.wrong'),
        $statsP= $stats.find('.pass'),
        $sw = $('#sw'),
        $cgState = $('#challengeState'),
        animComplete = $.Deferred(),
        challenge = { state: 'paused' },
        sW = new Worker('swWorker.js'),
        KEYCODES = { ANS: 13, PASS: 32 }

	;

    window.swW = sW;

    binds();
    init();
    worker();
    
    // fn
    // # anim
	function positionLetters(){
		var
			n=0,
			l=letterArr.length,
			cs=$parent.height(),
			cx=cs/2|0,
			cy=cx,
			cr=cx*.85|0,
			ddeg=360/l,
			delay=1000*.1
		;
		function getCoords(deg){
			var rad=deg*Math.PI/180;
			return {
				x:cx+cr*Math.sin(rad),
				y:cy+cr*Math.cos(rad)
			};
		}
		function position(letter,n){
			var
				coords=getCoords(n*ddeg),
				halfL=letter.r/2|0
			;
			letter.$elem.css({top:cs-coords.y-halfL,left:coords.x-halfL,opacity:0.9});
			if (n===letterArr.length-1) {
				animComplete.resolve();
			}
		}
		$.each(atw.Letters().getVal(),function(prop,letter){
			setTimeout(position.bind(null,letter,n),n*delay+(n%2*delay*5));
			n++;
		});
    }

    function postAnim() {
        atw.Letters().getVal('a').setCurrent();
    }
    
    // # challenge
    function getQ(letter) { 
        var d = $.Deferred();
        atw.db.q({
            "name": "questions",
            "method": "find",
            "args": {
                "selector": {
                    "_id": "0"
                },
                "fields": ["letter"]
            }
        })
        .then(function (res) {
            d.resolve(res.docs[0].letter[letter].q);
        })
        .fail();
        return d.promise();
    }
    function checkA(args) {
        clockPause();
        var sel = {'_id':'0'};
        sel["letter." + args.letter + ".a"] = args.a; 
        atw.db.q({
            "name": "questions",
            "method": "find",
            "args": {
                "selector": sel,
                "fields": ["_id"]
            }

        })
        .then(function (res) {
            if (res.docs.length) {
                atw.Letters().getCurrent().setState(atw.Letter.prototype.states.RIGHT);
            } else {
                atw.Letters().getCurrent().setState(atw.Letter.prototype.states.WRONG);
            }
            clockResume();
            atw.Letters().getNext().setCurrent();
            
        })
        .fail();
    }
    
    function renderQ(letter) {
        clockPause();
        getQ(letter)
        .then(function (res) {
            $qText.text(res);
            clearAns();
            clockResume();
        })
        .fail();
    }

    function clearAns() { 
        $ans.focus().val('');
    }
    
    function clockStart() {
        challenge.state = 'running';
        sW.postMessage({ cmd: 'start' });
        sW.postMessage({ cmd: 'pause' });
    }
    
    function clockPause() {
        challenge.state = 'paused';
        sW.postMessage({ cmd: 'pause' });
    
    }
    function clockResume() {
        challenge.state = 'running';
        sW.postMessage({ cmd: 'resume' });
    }
    function clockStop() {
        challenge.state = 'done';
    }

    function init(){ 
        $.each(letterArr, function (idx, val) {
            atw.Letters($parent).create(val);
        });
        positionLetters();
    }
	
    function binds() { 
        animComplete.promise().done(function () {
            $qContainer.delay(800).fadeIn()
		    .promise().done(postAnim);
        });
        $pass.on('click', function () { atw.Letters().getNext().setCurrent() });
        $start.on('click', function () {
            $(this).fadeOut().promise().done(function () {
                $pass.fadeIn();
                clockStart();
                atw.Letters().getCurrent().setCurrent();
            })
        });
        $parent.on('current', '.letter', function (e, letter) {
            if (challenge.state === 'running') {
                renderQ(letter.value);
            }
        });
        $parent.on('answer', '.letter', function (e, data) {
            if (challenge.state === 'running') {
                checkA(data);
            }
        });
        $parent.on('right wrong', '.letter', function (e, data) {
            increase($stats.find('.'+e.type));
        });
        $ans.on('keyup', function (e) {
            if (challenge.state === 'running') {
                if (e.which === KEYCODES.ANS) {
                    var current = atw.Letters().getCurrent();
                    current.$elem.trigger('answer', { letter: current.value, a: $(this).val().trim() });
                } else if (e.which === KEYCODES.PASS) {
                    $pass.trigger('click');
                }
            }
        });
    }
    function worker() {
        sW.addEventListener('message', function (e) {
            var data = e.data;
            switch (data.cmd) {
                case 'time':
                    $sw.text(formatTime(time2obj(data.args)));
                    $cgState.text(challenge.state);
                    break;
                case 'complete':
                    clockStop();
                    //alert('too slow');
                    break;
            }
        }, false);
        sW.postMessage({ 
            cmd: 'onTick', 
            args: "(function(){ return [function(){ self.postMessage({cmd:'time', args:sw.time}); }, 1] })()"
        });
        sW.postMessage({
            cmd: 'onComplete', 
            args: "(function(){ return [function(){ self.postMessage({cmd:'complete'});self.postMessage({cmd:'time', args:sw.time}); }] })()"
        });
        
    }
    function time2obj(mill) {

        var 
            secs = Math.floor(mill / 1000),
            hours = secs / (60 * 60) % 60 | 0,
            minutes = secs / 60 % 60 | 0,
            seconds = secs % 60,
            mills= (mill % 1000),
            obj = {
                "h": fill(hours,2),
                "m": fill(minutes,2),
                "s": fill(seconds, 2),
                "ms": fill(mills, 3)
            };
        return obj;

        function fill(x, l) { 
            return Array(l - x.toString().length + 1).join('0') + x;
        }


    }
    function formatTime(timeObj) {
        return timeObj.m + ':' + timeObj.s + ':' + timeObj.ms;;
    }
    function increase($elem) {
        var n = $elem.text()*1;
        $elem.text(++n);
    }
})();