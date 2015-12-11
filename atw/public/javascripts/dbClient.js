(function () {
    'use strict';
    var req = { name: 'questions', args: {} };

    function queryDB(conf) {
        return $.ajax({
            type: 'POST',
            url: '/yo.serv', 
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify($.extend({}, req, conf))
        })
    }
    
    window.atw = window.atw || {};
    atw.db = { q: queryDB };
})();
