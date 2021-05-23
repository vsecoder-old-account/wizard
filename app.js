// Import Express and DB
var express = require('express'),
  app = require('express')(),
  port = process.env.PORT || 5000,
  fire = require('./scripts/bd.js'),
  find = require('./scripts/find.js'),
  magic = require('./scripts/magic.js'),
  request = require('request');

//const cheerio = require("cheerio");

// import and use handlebars
var handlebars = require('express-handlebars')
  .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + '/public'));

// loging
app.all('*', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(`IP ${ip} open ${fullUrl}`);
  req.setMaxListeners(0);
  res.setHeader("Content-Type", "text/html");
  res.charset = 'utf-8';
  next();
});

// index
app.get(['/', '/index.html', '/index.js', '/index.php', '/index.py', '//'], function (req, res) {
  const start = new Date().getTime();
  var q = req.query;
  var read;
  var finde = q.q;
  var arr = [];
  if (q != undefined) {
    read = fire.read_bd();
    arr = magic.func(read, finde);
    if (arr.length == 0) {
      arr.push({
        "title": "Wizard",
        "url": "https://yandex.ru/search/?lr=10&text=" + finde,
        "description": "Мы не нашли подходящего результата у себя, воспользуйтесь Яндексом"
      });
      //console.log("https://yandex.ru/search/?lr=10&text=" + finde);
      //request("https://yandex.ru/search/?text=" + finde, function (err, res, body) {
      //  console.log(body);
      //  const $ = cheerio.load(body);
      //  for (let i = 0; i < 5; i++) {
      //    console.log($('.yuRUbf a', body)[i].attribs.href);
      //  }
      //});
    }
  }
  const end = new Date().getTime();
  var ms = end - start;
  console.log(arr);
  res.render('index', {q: q.q, ms: ms, finde: arr});
});

// add
app.get('/add', function (req, res) {
  var q = req.query;
  var url = q.url;
  var res = res;
  var er_title = 'Сайт не удалось добавить, проверьте наличие тегов title и meta на сайте!';
  if (url != undefined) {
    try {
      request(url, function (err, resu, body) {
        if (err || resu.statusCode != 200) {
          res.render('add', { text: 'Сайт не удалось добавить, код ошибки: ' + resu.statusCode + ' ' + err });
        }
        var title = body.match(/<title[^>]*>(.*?)<\/title>/gis);
        var description = body.match(/<meta property=\"og:description\" content=\"(.*?)\"*>/gis);
        if (title == null || description == null) {
          res.render('add', { text: er_title });
        } else {
          title = title[0].replace(/<title[^>]*>/gis, '');
          title = title.replace(/<\/title>/gis, '');
          description = description[0].replace(/<meta property=\"og:description\" content=\"/gis, '');
          description = description.replace(/\"\/>/gis, '');
          var result = {
            title: title,
            url: url,
            description: description
          };
          console.log(result);
          fire.set_bd(result.title, url, result.description);
          res.render('add', { text: 'Сайт удачно добавлен!' });
        }
      });
    } catch (error) {
      console.log(error);
      res.render('add', { text: er_title });
    }
  } else {
    res.render('add');
  }
});

// admin
app.get('/admin', function(req, res){
  res.render('admim');
});

// 404 catch-all
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

// 500 error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

// start app
app.listen(port, () => {
  console.log(`App listening at ${port}`);
  //console.log(fire.read_bd());
});
