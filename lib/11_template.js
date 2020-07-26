module.exports = {
    html:function(title, list, body, control){
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <input type="button", value="hi", onclick="alert('hi')";>
            <h1><a href="/" style=color:red;>WEB</a></h1>
            <div id="grid">
                ${list}
                ${control}
                ${body}
            </div>
            
        </body>
    </html>
    `;
    },
    list:function(topics){
        var list = '<ul>';
        var i = 0;
        while(i < topics.length){
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list
    },
    authorSelect:function(authors, author_id){
        var tag = '';
        var i  = 0;
        while(i < authors.length){
            var selected = '';
            if(author_id === authors[i].id){
                selected = ' selected';
            }
            tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
            i++;
        }
        return `
            <select name="author">
                ${tag}
            </select>
        `
    }
}

// authorSelect 함수 수정. 두 번째 인자로 현재 게시글의 작성자를 받음. 업데이트 페이지 작성자 선택에서 원래 작성자가 선택되어 있도록 함.