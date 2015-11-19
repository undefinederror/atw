(function () {
    'use strict';
    window.atw = window.atw || {};
    
    var _parent, arrLetters = [], current;
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
        storeCurrent: function (letter) { 
            current = letter;
        },
        getCurrent: function () {
            return current;
        },
        getNext: function () { 
            return _.find(_.takeRightWhile(arrLetters, function (letter) {
                return !_.isEqual(letter,current)
            }).concat(arrLetters), { state: atw.Letter.prototype.states.INIT });
        }

    }

    
    
    
    function Letters(parent){ 
        _parent = parent || _parent;
        return methods;
    }
    atw.Letters = Letters;





})();