(function(){
	'use strict';
    // var
    window.atw = window.atw || {};

	var
		letterArr=['a','b','c','d','e','f','g','h','i','l','m','n','o','p','q','r','s','t','u','v','z'],
        $parent = $('#circleContainer'),
        $qContainer=$parent.find('#questionContainer'),
        $qText= $qContainer.find('.question'),
		animComplete=$.Deferred()
	;

    // bind
    animComplete.promise().done(function () {
        $qContainer.delay(800).fadeIn()
		.promise().done(postAnim);
    });
    
    // init
    init();
    
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
            d.resolve(res.doc[0].letter[letter].q);
        })
        .fail();
        return d.promise();
    }
    function checkA(args) { 
        
    
    }
    
    function renderQ(letter) {
        clockPause();
        getQ(letter)
        .then(function (res) {
            $qText.text(res);
        })
        .fail();
        clockStart();

    }
    
    function clockStart() { 
    
    
    }
    
    function clockPause() { 
    
    
    }
    function init(){ 
        $.each(letterArr, function (idx, val) {
            atw.Letters($parent).create(val);
        });
        positionLetters();
    }
	
})();