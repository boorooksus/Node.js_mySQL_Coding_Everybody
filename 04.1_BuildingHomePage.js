var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var template = require('./lib/04.2_template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
// == 1 =========================================================
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
            // fs.readdir('./data', 'utf8', function(error, filelist){
            //     var title = 'Welcome';
            //     var description = 'Welcome';
            //     var list = template.list(filelist);
            //     var html = template.html(title, list, `<p><h2>${title}</h2>${description}</p>`, `<a href="/create">create</a>`);
            //     response.writeHead(200);
            //     response.end(html);
            // })
            // == 1 ===========================================================
            db.query(`SELECT * FROM topic`, function(err, topics){
                console.log(topics);
                response.writeHead(200);
                response.end('success');
            });
        }
        else{
            fs.readdir('./data', 'utf8', function(error, filelist){
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description);
                    var list = template.list(filelist);
                    var html = template.html(title, list, `<p><h2>${sanitizedTitle}</h2>${sanitizedDescription}</p>`, `<a href="/create">create</a>
                    <a href="/update?id=${sanitizedTitle}">update</a>
                    <form action=
                    "delete_process" method="post" onsubmit="return confirm('Do you want to delete?')">
                        <input type="hidden" name="id" value="${sanitizedTitle}"><input type="submit" value="delete">
                    </form>
                    `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }
    else if(pathname === '/create'){
        fs.readdir('./data', 'utf8', function(error, filelist){
            var title = 'Web create';
            //var description = 'Welcome';
            var list = template.list(filelist);
            var html = template.html(title, list, `
            <form action="/create_process" method="post">
                <p></p><input type="text" name="title" placeholder="Title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        })
    }
    else if(pathname === '/create_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            //전송된 내용으로 파일 생성
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                // 파일 생성 후 redirection
                response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
                response.end('success');
            })
        });
    }
    //update 링크를 눌렀을 때,
    else if(pathname === '/update'){
        fs.readdir('./data', 'utf8', function(error, filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.html(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" placeholder="title" value="${title}">
                        <p></p><input type="text" name="title" placeholder="Title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
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
            var id = post.id;
            var title = post.title;
            var description = post.description;
            //이름 변경
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                //본문 변경
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
                    response.end('success');
                })
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
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end('success');
            })
        });
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
});
app.listen(3000);


// node.js 어플리케이션이 mysql에서 데이터를 가져오도록 구현
// 1: 3.1_mysql.js를 참조하여 프로그래밍