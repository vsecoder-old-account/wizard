const JsonFind = require("json-find");

module.exports.find = function (json, text) {
  var doc = JsonFind(json);
  return doc.findValues(text);
};
