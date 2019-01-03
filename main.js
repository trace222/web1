var http = require('http');
var fs = require('fs');
var url=require('url');
var qs=require('querystring');
var template = require('./lib/template.js');
var path=require('path');
var sanitizeHtml=require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData=url.parse(_url,true).query;
    var title=queryData.id;
    var pathname=url.parse(_url,true).pathname;
    if(pathname==='/'){
    if(queryData.id==undefined)
    {
      fs.readdir('./data',function(err,filelist){


      var title='Wlemkcom';
      var description="hello jos";
      var list=template.List(filelist);
      var html=template.HTML(title,list,`<h1>${title}</h1>${description}`,'<a href="/create">create</a>');
      response.writeHead(200);
      response.end(html);
        })
    }
else {
  fs.readdir('./data',function(err,filelist){
 var filteredId=path.parse(queryData.id).base;
  var list=template.List(filelist);
  fs.readFile(`data/${filteredId}`,'utf-8',function(err,description){
    var title=queryData.id;
    var sanitizeTitle=sanitizeHtml(title);
    var sanitizeDescription=sanitizeHtml(description);
      var html=template.HTML(title,list,`<h1>${sanitizeTitle}</h1>${sanitizeDescription}`,`<a href="/create">create</a>
                <a href="/update?id=${sanitizeTitle}">update</a>
                <form action="delete_process" method="post" onsubmit="confirm('ok?')" >
                  <input type="hidden" name="id" value="${sanitizeTitle}">
                  <input type="submit" value="delete">
                </form>`);
    response.writeHead(200);
    response.end(html);
  });
});
}
}
else if(pathname==='/create')
{
  fs.readdir('./data',function(err,filelist){


  var title='WEB-create';

  var list=template.List(filelist);
  var html=template.HTML(title,list,`<form action="http://localhost:3000/process_create" method="post">
    <p><input type="text" name="title"></p>
    <p>
      <textarea name="description"></textarea>
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
`,'');
  response.writeHead(200);
  response.end(html);
});
}
else if(pathname==='/process_create')
{ var body='';
  request.on('data',function(data){
  body=body+data;
});
request.on('end',function(){
  var post=qs.parse(body);
  var title=post.title;
  var filteredtitle=path.parse(title).base;
  var description=post.description;
  var sanitizeDescription=sanitizeHtml(description);
  fs.writeFile(`data/${filteredtitle}`,sanitizeDescription,'utf-8',function(err){
    response.writeHead(302,{Location:`/?id=${filteredtitle}`});
    response.end();
  });
});
}
else if(pathname==='/update')
{
  fs.readdir('./data',function(err,filelist){

  fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
  var list=template.List(filelist);
    var title=queryData.id;
      var html=template.HTML(title,list,`<form action="/update_process" method="post">
      <p><input type="hidden" name="id" value=${title}></p>
        <p><input type="text" placeholder="title" name="title" value=${title}></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>`,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
    response.writeHead(200);
    response.end(html);
  });
});
}
else if(pathname === '/update_process')
{
  var body='';
    request.on('data',function(data){
    body= body + data;
  });
  request.on('end',function(){
    var post=qs.parse(body);
    filteredtitle
    var id=post.id;
    var title=post.title;
    var filteredtitle=path.parse(title).base;
    var filteredId=path.parse(id).base;
    var description=post.description;
    fs.rename(`data/${filteredId}`,`data/${filteredtitle}`,function(error){
      fs.writeFile(`data/${filteredtitle}`,description,'utf-8',function(err){
        response.writeHead(302,{Location:`/?id=${filteredtitle}`});
        response.end();
      })
      });
});
}
else if(pathname === '/delete_process')
{
  var body='';
  request.on('data',function(data){
    body=body+data;
  });
  request.on('end',function(){
    var post=qs.parse(body);
    var id=post.id;
    var filteredId=path.parse(id).base;
    fs.unlink(`data/${filteredId}`,function(error){
      response.writeHead(302,{Location:`/`});
      response.end();
    })
  });
}
else {
  response.writeHead(404);
  response.end('nod tfon')
}

});
app.listen(3000);
