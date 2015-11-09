(function(){
	'use strict';
	
	var
		letterArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'z'],
        req = { name: 'questions', args: {} },
        $qId=$('#qId'),
        $questionLi = $('#qUL >li'),
        $konsole = $('section.konsole pre code')


	;
    
    // binds
    $qId.on('change', function () {
        var id = $(this).val();
        queryDB({method:'get',args: {"_id":id}})
         .then(function (res) {
            konsole(res);
            //var arrIds = res.rows.map(function (item) {
            //    return item.id
            //}).sort(function (a, b) {
            //    return (a | 0) - (b | 0)
            //});
            //populateIdDrop(arrIds);

        })
        .fail(function (err) { konsole(err) })
        ;
    
    
    })
    init();
    
    
    // fn
    function makeObj() { 
       
    
    
    }
    function queryDB(conf) { 
        return $.ajax({
            type: 'POST',
            url: '/yo.serv', 
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify($.extend({}, req, conf ))
        })
    
    }
    function getIds() {
        queryDB({ method: 'allDocs' })
        .then(function (res) {
            konsole(res);
            var arrIds = res.rows.map(function (item) {
                return item.id
            }).sort(function (a, b) {
                return (a | 0) - (b | 0)
            });
            populateIdDrop(arrIds);

        })
        .fail(function (err) {konsole(err) })
        ;
    }
    function konsole(txt) {
        var out = txt;
        if (typeof txt === 'object') out = JSON.stringify(txt);
        $konsole.text(out);
        Prism.highlightAll();
    }
    function populateIdDrop(arr) {
        arr.unshift('choose id');
        var out = '', opt = '<option value="[[id]]">[[id]]</option>';
        $.each(arr, function (idx,id) { 
            out += opt.replace(/\[\[id\]\]/g, id);
        })
        $qId.html(out);
    }
    
    
    function init() { 
        getIds();
    
    
    }

    
        
	
})();