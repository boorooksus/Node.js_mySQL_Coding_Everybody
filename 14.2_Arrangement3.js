var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var template = require('./lib/11_template.js');
var db = require('./lib/13_db.js')
var topic = require('./lib/14.2_topic');


var app = http.createServer(function(request,response){
    var _url = request.url; //query string 저장
    var queryData = url.parse(_url, true).query; //query string 분석해서 얻어낸 데이터 저장하는 객체
    var pathname = url.parse(_url, true).pathname;

    if(pathname ==='/'){
        if(queryData.id === undefined){
            topic.home(request, response);
        }
        else{
            topic.page(request, response);
        }
    }
    else if(pathname === '/create'){
        topic.create(request, response);
    }
    else if(pathname === '/create_process'){
        topic.create_process(request, response);
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
                db.query(`SELECT * FROM author`, function(error3, authors){
                    var list = template.list(topics);
                    var html = template.html(topic[0].title, list,  `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id"  value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="Title" value="${topic[0].title}">
                        ${template.authorSelect(authors, topic[0].author_id)}
                        </p>
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
            db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,[post.title, post.description, post.author, post.id], function(error, result){
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
            db.query(`DELETE FROM topic WHERE id=?`,[post.id],function(error, result){
                response.writeHead(302, {location: `/`});
                response.end();
            });
        });
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
});
app.listen(3000);


// 상세보기 페이지, 글 생성 페이지 정리정돈