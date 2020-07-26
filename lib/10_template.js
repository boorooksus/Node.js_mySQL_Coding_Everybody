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
    authorSelect:function(authors){
        var tag = '';
        var i  = 0;
        while(i < authors.length){
            tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
            i++;
        }
        return `
            <select name="author">
                ${tag}
            </select>
        `
    }
}

// authorSelect 함수 추가. 작성자 목록 선택.