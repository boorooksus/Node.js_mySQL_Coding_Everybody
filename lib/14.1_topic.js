var db = require('./13_db.js');
var template = require('./11_template.js');
// == 1 =======================
exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(err, topics){
        var title = 'Welcome';
        var description = 'Welcome';
        var list = template.list(topics);
        var html = template.html(title, list, `<p><h2>${title}</h2>${description}</p>`, `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
    });
}


// 1: module 하나만 export 할 때에는 'module.exports',
//  여러개 export 할 때에는 'exports' 사용