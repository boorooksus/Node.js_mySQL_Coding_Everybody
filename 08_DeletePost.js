var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var template = require('./lib/04.2_template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
    host:'',
    user:'',
    password:'',
    database:''
});
db.connect();


var app = http.createServer(function(request,response){
    var _url = request.url; //query string 저장
    var queryData = url.parse(_url, true).query; //query string 분석해서 얻어낸 데이터 저장하는 객체
    var pathname = url.parse(_url, true).pathname;

    if(pathname ==='/'){
        if(queryData.id === undefined){
            db.query(`SELECT * FROM topic`, function(err, topics){
                var title = 'Welcome';
                var description = 'Welcome';
                var list = template.list(topics);
                var html = template.html(title, list, `<p><h2>${title}</h2>${description}</p>`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        }
        else{
            db.query(`SELECT * FROM topic`, function(error, topics){
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
                    if(error2){
                        throw error2;
                    }
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.html(title, list, `<p><h2>${title}</h2>${description}</p>`, `<a href="/create">create</a>
                    <a href="/update?id=${queryData.id}}">update</a>
                    <form action=
                    "delete_process" method="post" onsubmit="return confirm('Do you want to delete?')">
                        <input type="hidden" name="id" value="${queryData.id}"><input type="submit" value="delete">
                    </form>
                    `);
                    response.writeHead(200);
                    response.end(html);
                })
            });
        }
    }
    else if(pathname === '/create'){
        db.query(`SELECT * FROM topic`, function(err, topics){
            var title = 'Create';
            var list = template.list(topics);
            var html = template.html(title, list, 
                `
                 <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="Title"></p>
                     <p>
                         <textarea name="description" placeholder="description"></textarea>
                     </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
            '');
            
            response.writeHead(200);
            response.end(html);
        });

    }
    else if(pathname === '/create_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);

            db.query(`
                INSERT INTO topic (title, description, created, author_id) VALUE(?, ?, NOW(), ?)`,
                [post.title, post.description, 1],
                function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {location: `/?id=${result.insertId}`});
                    response.end();
                }
            )


        });
    }
    //update 링크를 눌렀을 때,
    else if(pathname === '/update'){
        db.query(`SELECT * FROM topic`, function(error, topics){
            if(error){
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
                if(error2){
                    throw error2;
                }
                var list = template.list(topics);
                var html = template.html(topic[0].title, list,  `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id"  value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="Title" value="${topic[0].title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>
                `);
                response.writeHead(200);
                response.end(html);
            });
        });

    }
    //수정 사항 작성 후 전송 눌른 후
    else if (pathname ==='/update_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){

            var post = qs.parse(body);
            db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,[post.title, post.description, post.id], function(error, result){
                response.writeHead(302, {location: `/?id=${post.id}`});
                response.end();
            });

        });
    }
    //삭제 버튼 누른 후
    else if (pathname ==='/delete_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            // == 1 ============================================================================
            db.query(`DELETE FROM topic WHERE id=?`,[post.id],function(error, result){
                response.writeHead(302, {location: `/`});
                response.end();
            });
            // =======================================================================
        });
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
});
app.listen(3000);


// mysql로 글 삭제 기능 구현
// 1: 수정 내용
