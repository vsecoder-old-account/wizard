// Import Express and DB
var express = require('express'),
  app = require('express')(),
  port = process.env.PORT || 5000,
  fire = require('./scripts/bd.js'),
  find = require('./scripts/find.js'),
  magic = require('./scripts/magic.js');

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
        "url": "https://yandex.ru/?q=" + finde,
        "description": "Мы не нашли подходящего результата у себя, воспользуйтесь Яндексом"
      });
    }
  }
  const end = new Date().getTime();
  var ms = end - start;
  console.log(arr);
  res.render('index', {q: q.q, ms: ms, finde: arr});
});

// add
app.get('/add', function(req, res){
  res.render('add');
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
