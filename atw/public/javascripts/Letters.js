(function () {
    'use strict';
    window.atw = window.atw || {};
    
    var _parent, arrLetters = [];
    var methods = {
        create: function (letter) { 
            arrLetters.push(new atw.Letter(letter,_parent));
        },
        getVal: function (letter) {
            if(letter){
                return _.find(arrLetters,{value:letter});
            }else{
                return arrLetters;
            }
        },
        getState: function (state) {
            return _.filter(arrLetters,{state:state});
        },
        getNext: function () { 
            return _.find(_.takeRightWhile(arrLetters, function (letter){
                return letter.state !== atw.Letter.prototype.states.CURRENT
            }), {state:atw.Letter.prototype.states.INIT})
        }

    }

    
    
    
    function Letters(parent){ 
        _parent = parent || _parent;
        return methods;
    }
    atw.Letters = Letters;





})();