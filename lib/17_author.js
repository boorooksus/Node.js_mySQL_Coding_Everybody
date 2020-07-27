var db = require('./13_db.js');
var template = require('./16_template.js');
var qs = require('querystring');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(err, topics){
        db.query(`SELECT * FROM author`, function(err1, authors){
            
            var title = 'Authors';
            var list = template.list(topics);
            var html = template.html(title, list, 
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse:collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `, 
            `       
            `);
            response.writeHead(200);
            response.end(html);
        });   
    });
}

exports.create_process = function(request, response){
    var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);

            db.query(`
                INSERT INTO author (name, profile) VALUE(?, ?)`,
                [post.name, post.profile],
                function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {location: `/author`});
                    response.end();
                }
            )


        });
}