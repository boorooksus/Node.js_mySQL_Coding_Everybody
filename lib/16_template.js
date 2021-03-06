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
            <a href="/author">author</a>
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
    },
    authorTable:function(authors){
        var tag = '<table>';
            var i = 0;
            while(i < authors.length){
                tag += `
                    <tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td>update</td>
                        <td>delete</td>
                    </tr>
                    `
                i++;
            }
            tag += '</table>'
        return tag
    }
}

// 저자 목록 페이지로 가는 링크 추가