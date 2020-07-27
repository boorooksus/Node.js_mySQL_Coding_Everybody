var http = require('http');
var fs = require('fs');
var url = require('url')
var topic = require('./lib/16_topic');
var author = require('./lib/16_author');


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
    else if(pathname === '/update'){
        topic.update(request, response);
    }
    else if (pathname ==='/update_process'){
        topic.update_process(request, response);
    }
    else if (pathname ==='/delete_process'){
        topic.delete_process(request, response);
    }
    else if (pathname ==='/author'){
        author.home(request, response);
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
});
app.listen(3000);


// 저자 관리 기능 구현