var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var template = require('./lib/11_template.js');
var db = require('./lib/13_db.js')
var topic = require('./lib/14.3_topic');


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
        topic.update(request, response);
    }
    //수정 사항 작성 후 전송 눌른 후
    else if (pathname ==='/update_process'){
        topic.update_process(request, response);
    }
    //삭제 버튼 누른 후
    else if (pathname ==='/delete_process'){
        topic.delete_process(request, response);
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
});
app.listen(3000);


// 나머지 부분 정리정돈