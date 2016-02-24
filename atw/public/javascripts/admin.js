(function(){
	'use strict';
	
	var
		letterArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'z'],
        $qIdSelect = $('#qIdSelect'),
        $konsole = $('section.konsole pre code'),
        $btnAction = $('button[data-action]'),
        $nRecs=$('#nRecs')


	;
    
    // binds
    $qIdSelect.on('click', 'li', function () {
        getId($(this).text(), true)
    });

    $btnAction.on('click', function () {
        var action = $(this).attr('data-action'), dbAction= action, obj = {};
        switch (action) {
            case 'put':
            case 'remove':
                obj = makeObj();
                break;
            case 'new':
                obj: { };
                dbAction = 'put';
                break;
        }
        
        atw.db.q({ method: dbAction, args: obj })
        .then(function (res) {
            konsole(res);
            switch (action) {
                case 'put':
                    getId(res.id, false);
                    getIds(false);
                    break;
                case 'remove':
                    getIds(false);
                    ghostRev();
                    break;
                case 'new':
                    getId(res.id, false);
                    getIds(false);
                    break;
            }
            
        })
        .fail(onFail)
        ;
    });

    

    init();
    
    
    // fn
    function makeObj() { 
        var obj = {},
            $elems = $('[data-db]')
        ;
        $.each($elems, function () {
            _.set(obj, $(this).attr('data-db'), $(this).val());
        });
        return obj;
    }

    function populate(obj) {
        var $elems = $('[data-db]');
        $.each($elems, function () {
            $(this).val(_.get(obj, $(this).attr('data-db'), null));
        });
    }

    function getIds(verbose) {
        atw.db.q({ method: 'getIds',args: {limit:null} })
        .then(function (res) {
            verbose && konsole(res);
            var arrIds = _.pluck(res.docs, 'n').reverse()
            populateIdDrop(arrIds);
            updateRecNum(arrIds.length);
        })
        .fail(onFail)
        ;
    }

    function getId(id, verbose) {
        atw.db.q({ method: 'get', args: id })
         .then(function (res) {
            verbose && konsole(res);
            populate(res);
        })
        .fail(onFail)
        ;
    }

    function blank() { 
        populate({});
    }
    function ghostRev() {
        var r = $('[data-db=_rev]').val();
        $('[data-db=_rev]').attr('placeholder', r).val('');
    }
    function konsole(txt) {
        var out = txt;
        if (typeof txt === 'object') out = JSON.stringify(txt,null,2);
        $konsole.text(out);
        Prism.highlightAll();
    }
    function populateIdDrop(arr) {
        var out = '', opt = '<li><a href="javascript:;">[[id]]</a></li>';
        $.each(arr, function (idx,id) { 
            out += opt.replace(/\[\[id\]\]/g, id);
        })
        $qIdSelect.html(out);
    }
    function updateRecNum(n) { 
        $nRecs.text(n);
    }
    
    function onFail(err) { konsole(err) }
    
    function init() { 
        getIds(true);
    }

    
        
	
})();