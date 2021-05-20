// In this file MAGIC

module.exports.func = function (read, finde) {
  if (read == undefined) {
    return;
  }
  var arr = [];
  var finding = 0;
  try {
    finde = finde.split(" ");
    for (let index = 0; index < finde.length; index++) {
      var element = finde[index];
      try {
        for (let i = 0; i < 999999999999; i++) {
          var web = read[i].web;
          var q_el = read[i].web.description.split(" ");
          for (let m = 0; m < q_el.length; m++) {
            var m_el = q_el[m].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            m_el = m_el.toLowerCase();
            element = element.toLowerCase();
            console.log(element + ' | ' + m_el + ' = ' + finding);
            if (element == m_el && finding <= 9) {
              arr.push({
                "title": web.title,
                "url": web.url,
                "description": web.description
              });
              finding++;
            }
          }

        }
      } catch (error) {
        // TODO: deelte try ... catch
      }
    }
    if (finding == 0) {
      // TODO: parse yandex if result not find
    }
  } catch (error) {
    console.log(error);
  }
  console.log(arr);
  return arr;
};
