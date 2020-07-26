var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '', //mySql이 이 컴퓨터에 저장되어 있음
  user     : '', //mySql name
  password : '', //mySql 비밀번호
  database : ''
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
      console.log(error);
  }
  console.log(results);
});
 
connection.end();