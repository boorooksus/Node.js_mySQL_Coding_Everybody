var db = require('./13_db.js');
var template = require('./16_template.js');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(err, topics){
        db.query(`SELECT * FROM author`, function(err1, authors){
            
            var title = 'Authors';
            var list = template.list(topics);
            var html = template.html(title, list, 
                `
                ${template.authorTable(authors)}
                <style>
                    table-border-collapse:collapse;
                    td{
                        border:1px solid black;
                    }
                </style>
                `, 
            `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });   
    });
}