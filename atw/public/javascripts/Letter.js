(function(){
	'use strict';
    
    window.atw = window.atw || {};

    var LetterProto =  {
        states: {
            INIT: 'init',
            RIGHT: 'right',
            WRONG: 'wrong',
            CURRENT: 'current'
        },
        coords: { top: '45%', left: '45%' },
        r: 50,
        html: '<div class="letter">[[l]]</div>',
        createElement: function () {
            var html = this.html.replace('[[l]]', this.value);
            var $elem = $(html).addClass(this.state);
            $elem
				.css(this.coords)
				.css({ height: this.r, width: this.r });
            //.css('opacity',0.9);
            this.parent.append($elem);
            return $elem;
        },
        setState: function (state) {
            var 
				_this = this,
                klass = Object.keys(this.states).map(function (k) {
                    return _this.states[k];
                }).join(' '),
                active= atw.Letters().getState(this.states.CURRENT)
			;
            if (active.length && !_.isEqual(active[0], this)) {
                active[0].setState(this.states.INIT);
            }
            this.state = state;
            this.$elem.removeClass(klass).addClass(state).trigger(state, this);
        },
        setCurrent: function () {
            this.setState(this.states.CURRENT);
            atw.Letters().storeCurrent(this);
        }
	};
	
	function Letter(val,parent){
		this.parent=parent;
		this.state=	this.states.INIT;
		this.value=val;
		this.$elem=this.createElement();
	}
	$.extend(Letter.prototype,Object.create(LetterProto));
	
	atw.Letter=Letter;
	
})();