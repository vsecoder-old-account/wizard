// DB
const admin = require('firebase-admin');
const config = require('./config.js');
var read = '';
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: config.APPID,
        privateKey: config.PRIVATE_KEY,
        clientEmail: config.CLIENT_MAIL,
    }),
    databaseURL: config.DATABASE_URL
});

//var serviceAccount = require("./firebase.json");

function set_bd(title, url, description, num) {
  if (title == undefined) {
    return false;
  } else {
    var db = admin.database();
    var ref = db.ref("wizard/" + num);
    var wizard = ref.child("web");
    wizard.set({
      title: title,
      url: url,
      description: description
    });
    return true;
  }
}

//set_bd("Google", "https://google.com", "Поиск информации в интернете: веб страницы, картинки, видео и многое другое.", 0);

function read_bd() {
  var db = admin.database();
  var ref = db.ref("wizard");
  ref.on("value", function (snapshot) {
    read = snapshot.val();
    return snapshot.val();
  });
}
read_bd();

module.exports.read_bd = function () {
  read_bd();
  return read;
};
module.exports.set_bd = set_bd;
