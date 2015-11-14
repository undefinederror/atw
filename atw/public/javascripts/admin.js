(function(){
	'use strict';
	
	var
		letterArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'z'],
        req = { name: 'questions', args: {} },
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
        
        queryDB({ method: dbAction, args: obj })
        .then(function (res) {
            konsole(res);
            if (action !== 'put') { getIds(false) }
            if (action === 'new') { getId(res.id,false) }
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

    function queryDB(conf) { 
        return $.ajax({
            type: 'POST',
            url: '/yo.serv', 
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify($.extend({}, req, conf ))
        })
    }

    function getIds(verbose) {
        queryDB({ method: 'allDocs' })
        .then(function (res) {
            verbose && konsole(res);
            var arrIds = res.rows.map(function (item) {
                return item.id
            }).sort(function (a, b) {
                return (a | 0) - (b | 0)
            });
            populateIdDrop(arrIds);
            updateRecNum(arrIds.length);

        })
        .fail(onFail)
        ;
    }

    function getId(id, verbose) {
        queryDB({ method: 'get', args: id })
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
    function konsole(txt) {
        var out = txt;
        if (typeof txt === 'object') out = JSON.stringify(txt);
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