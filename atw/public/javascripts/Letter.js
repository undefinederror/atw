(function(){
	'use strict';
	
	var LetterProto={
		states:{
			INIT:'init',
			RIGHT:'right',
			WRONG:'wrong',
			CURRENT:'current'
		},
		coords:{top:'45%',left:'45%'},
		r:50,
		html:'<div class="letter">[[l]]</div>',
		createElement:function(){
			var html=this.html.replace('[[l]]',this.value);
			var $elem=$(html).addClass(this.state);
			$elem
				.css(this.coords)
				.css({height:this.r,width:this.r});
				//.css('opacity',0.9);
			this.parent.append($elem);
			return $elem;
		},
		setState:function(state){
			var
				_this=this,
				klass=Object.keys(this.states).map(function(k){
					return _this.states[k];
				}).join(' ')
			;
			this.state=state;
			this.$elem.removeClass(klass).addClass(state);
		}
	};
	
	function Letter(val,parent){
		this.parent=parent;
		this.state=	this.states.INIT;
		this.value=val;
		this.$elem=this.createElement();
	}
	Letter.prototype=Object.create(LetterProto);
	
	window.Letter=Letter;
	
})();