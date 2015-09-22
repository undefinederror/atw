(function(){
	'use strict';
	
	var
		letterArr=['a','b','c','d','e','f','g','h','i','l','m','n','o','p','q','r','s','t','u','v','z'],
		letterObj={},
		$parent=$('#circleContainer'),
		animComplete=$.Deferred()
	;
	
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
		$.each(letterObj,function(prop,letter){
			setTimeout(position.bind(null,letter,n),n*delay+(n%2*delay*5));
			n++;
		});
	}
	$.each(letterArr,function(idx,val){
		letterObj[val]=new Letter(val,$parent);
	});
	positionLetters();
	animComplete.done(function(){
		$('#questionContainer').delay(800).fadeIn()
		.promise().done(postAnim);
	});
	
	function postAnim() {
		letterObj.a.setState(Letter.prototype.states.CURRENT);
	}
	window.letterObj=letterObj;
	
})();